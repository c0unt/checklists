--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

--
-- Name: getsessionobject(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE or replace FUNCTION  getsessionobject(session_id uuid, OUT object_id uuid) RETURNS uuid
    LANGUAGE sql
    AS $_$
 
   select o.object_id from ref_object_owners o 
   inner join tmp_sys_sessions s on s.user_id=o.user_id 
   where s.id=$1;
 
$_$;


create or replace FUNCTION public.getsessionobject(session_id uuid, OUT object_id uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: data_checklist_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS  data_checklist_content (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    checklist_id uuid NOT NULL,
    check_order integer,
    name text,
    content text,
    comment text,
    pass boolean,
    pass_dts timestamp with time zone,
    pass_user_id uuid,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid
);


ALTER TABLE data_checklist_content OWNER TO postgres;

--
-- Name: data_checklists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS   data_checklists (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text,
    version text,
    status boolean,
    status_user_id uuid,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid
);


ALTER TABLE   data_checklists OWNER TO postgres;

--
-- Name: data_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS  data_log (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    action text,
    data text,
    "user" uuid,
    token uuid
);


ALTER TABLE data_log OWNER TO postgres;

--
-- Name: ref_rpt_dataset_params; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_rpt_dataset_params (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text,
    query text,
    "default" text,
    dataset_id uuid,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid,
    kind text DEFAULT 'text'::text NOT NULL,
    sys_name text DEFAULT 'param1'::text NOT NULL
);


ALTER TABLE ref_rpt_dataset_params OWNER TO postgres;

--
-- Name: ref_rpt_datasets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_rpt_datasets (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text,
    query text,
    right_id uuid,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid
);


ALTER TABLE ref_rpt_datasets OWNER TO postgres;

--
-- Name: ref_rpt_report_datasets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_rpt_report_datasets (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    report_id uuid,
    dataset_id uuid,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid
);


ALTER TABLE ref_rpt_report_datasets OWNER TO postgres;

--
-- Name: ref_rpt_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_rpt_reports (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text,
    right_id uuid,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid
);


ALTER TABLE ref_rpt_reports OWNER TO postgres;

--
-- Name: ref_rpt_views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_rpt_views (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text,
    path text,
    maket text,
    report_id uuid,
    right_id uuid,
    generator text,
    state integer DEFAULT 0 NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    object_id uuid
);


ALTER TABLE ref_rpt_views OWNER TO postgres;

--
-- Name: ref_sys_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_sys_applications (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    dts timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    code text NOT NULL,
    right_id uuid NOT NULL,
    state integer DEFAULT 0 NOT NULL,
    color text
);


ALTER TABLE ref_sys_applications OWNER TO postgres;

--
-- Name: ref_sys_menuitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_sys_menuitems (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    state integer DEFAULT 0 NOT NULL,
    path text,
    icon text,
    right_id uuid,
    application_id uuid
);


ALTER TABLE ref_sys_menuitems OWNER TO postgres;

--
-- Name: ref_sys_rights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_sys_rights (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    tag text,
    state integer DEFAULT 0 NOT NULL
);


ALTER TABLE ref_sys_rights OWNER TO postgres;

--
-- Name: ref_sys_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_sys_states (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE ref_sys_states OWNER TO postgres;

--
-- Name: ref_sys_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_sys_users (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    pass text,
    state integer DEFAULT 0 NOT NULL,
    email text,
    telegram text
);


ALTER TABLE ref_sys_users OWNER TO postgres;

--
-- Name: ref_sys_users_x_rights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS ref_sys_users_x_rights (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    right_id uuid NOT NULL,
    state integer DEFAULT 0 NOT NULL,
    CONSTRAINT check1 CHECK (true)
);


ALTER TABLE ref_sys_users_x_rights OWNER TO postgres;

--
-- Name: tmp_sys_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE  IF NOT EXISTS tmp_sys_sessions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    dts timestamp with time zone DEFAULT (now() + '01:00:00'::interval)
);


ALTER TABLE tmp_sys_sessions OWNER TO postgres;

--
-- Data for Name: data_checklist_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO data_checklist_content (id, checklist_id, check_order, name, content, comment, pass, pass_dts, pass_user_id, state, dts, object_id) VALUES ('7a35c0b9-2d04-41e9-b670-e0b767247223', '6b007651-6cb9-4576-9d3c-dd90d02a6c93', 1, 'test check', 'do check', NULL, NULL, NULL, NULL, 0, '2018-01-03 21:35:37.550954+03', NULL);


--
-- Data for Name: data_checklists; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO data_checklists (id, name, version, status, status_user_id, state, dts, object_id) VALUES ('6b007651-6cb9-4576-9d3c-dd90d02a6c93', 'test checklist', 'none12', true, NULL, 0, '2018-01-03 21:34:26.436179+03', NULL);
INSERT INTO data_checklists (id, name, version, status, status_user_id, state, dts, object_id) VALUES ('293a9d7e-6870-4aa8-81ae-5d80a0fc38f0', 'test check list', 'none', NULL, NULL, 0, '2018-01-11 23:06:44.648659+03', NULL);
INSERT INTO data_checklists (id, name, version, status, status_user_id, state, dts, object_id) VALUES ('610dcb24-f455-4375-bb54-7dbffd9f548a', 'My new checklis', '123', NULL, NULL, 0, '2018-01-04 00:33:19.633141+03', NULL);


--
-- Data for Name: data_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('6811ddd3-c3d5-4730-a5fa-c4f294f3bd7e', '2017-12-17 08:33:05.981149+03', 'getIdentInfo', '{"code":"123"}', NULL, NULL);
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('135e3bd9-7bbf-4eb4-98f8-127a7db9506c', '2017-12-17 08:44:36.810924+03', '00000000-0000-0000-0000-000000000000', 'getIdentInfo', NULL, NULL);
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('5fd6188e-1b48-44af-ab26-871d2099d940', '2017-12-17 08:44:36.816358+03', '00000000-0000-0000-0000-000000000000', 'getIdentInfo result', NULL, NULL);
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('301f34fa-e5a8-4dd2-a500-72310d2d6310', '2017-12-17 08:45:27.433096+03', 'getIdentInfo', '{"code":"1232"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('3a6b07f7-a099-407b-8d87-5d956f2c5a36', '2017-12-17 08:45:27.438524+03', 'getIdentInfo result', '{"error_code":"666001","error_text":"no such active token"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('d800d0b9-8a16-4aea-9c56-309510dd47f4', '2017-12-17 08:49:01.470262+03', 'getIdentInfo', '{"fullQuery":{"code":"1232","wer":"234234werewr"},"code":"1232"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('915e6648-145e-40a6-9572-51d1a290b89e', '2017-12-17 08:49:01.475241+03', 'getIdentInfo result', '{"error_code":"666001","error_text":"no such active token"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('0153e7da-205f-4183-a4c6-5abbf72962e8', '2017-12-17 08:51:42.770052+03', 'getIdentInfo', '[object Object]>>[object Object]', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('89c575cb-8faf-49c6-ac32-9f5aa2a380de', '2017-12-17 08:51:42.775458+03', 'getIdentInfo result', '{"error_code":"666001","error_text":"no such active token"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('a884b60a-3ecc-4b1f-a771-f4e085cada3b', '2017-12-17 08:55:59.409375+03', 'getIdentInfoBody', '{"code":"123"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('61b15b5b-36cc-40d7-8410-9c69588b1013', '2017-12-17 08:55:59.409161+03', 'getIdentInfoQuery', '{"code":"1232","wer":"234234werewr"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('f90bb01d-f290-48ec-8e3e-55a5665b1d64', '2017-12-17 08:55:59.40794+03', 'getIdentInfo', '{"code":"1232"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('8b8d5776-3ce9-4af9-85fc-0fd9d1c24b39', '2017-12-17 08:55:59.418643+03', 'getIdentInfo result', '{"error_code":"666001","error_text":"no such active token"}', NULL, '00000000-0000-0000-0000-000000000000');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('8420d377-3d94-48ad-bb16-6f1b75fa5e92', '2017-12-17 10:40:56.305155+03', 'getIdentInfoQuery', '{"code":"123"}', NULL, 'aedf5e3b-0043-4d65-90dd-dbc308b7f76b');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('20c92718-4532-4889-9bfc-fab564068791', '2017-12-17 10:40:56.303943+03', 'getIdentInfo', '{"code":"123"}', NULL, 'aedf5e3b-0043-4d65-90dd-dbc308b7f76b');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('973e42b1-f2d9-4519-b71a-32b3c6b95c0e', '2017-12-17 10:40:56.306194+03', 'getIdentInfoBody', '{"code":"123"}', NULL, 'aedf5e3b-0043-4d65-90dd-dbc308b7f76b');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('36aa820b-292b-42df-909d-4a46b728e94b', '2017-12-17 10:40:56.321018+03', 'getIdentInfo result', '{"ident_id":"4ef5c93f-2491-4d65-8933-f5113cdc9206","ident_code":"123","holder_id":null,"name":"токен","discount_code":76,"bonus_code":89}', NULL, 'aedf5e3b-0043-4d65-90dd-dbc308b7f76b');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('60078c3b-e2a1-4926-8a69-36ca89951c30', '2017-12-19 03:09:34.382547+03', 'getIdentInfoQuery', '{"code":"123"}', NULL, '7bf46c10-b8ac-4c8c-98e2-32dd9b3ff9b3');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('c3805a7d-e06f-4d15-a4b6-5be2bab78165', '2017-12-19 03:09:34.38207+03', 'getIdentInfo', '{"code":"123"}', NULL, '7bf46c10-b8ac-4c8c-98e2-32dd9b3ff9b3');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('07c2a37b-77dd-4cfa-96ea-26872a838c03', '2017-12-19 03:09:34.425934+03', 'getIdentInfo result', '{"ident_id":"4ef5c93f-2491-4d65-8933-f5113cdc9206","ident_code":"123","holder_id":null,"name":"токен","discount_code":76,"bonus_code":89}', NULL, '7bf46c10-b8ac-4c8c-98e2-32dd9b3ff9b3');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('5ed245f4-0d27-4ba3-97e4-0b11a5411311', '2017-12-19 03:09:34.382667+03', 'getIdentInfoBody', '{}', NULL, '7bf46c10-b8ac-4c8c-98e2-32dd9b3ff9b3');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('9d46bdd8-a301-444c-b645-f67c5d3ee57e', '2017-12-19 03:10:07.62864+03', 'getIdentInfo', '{"code":"79173413853"}', NULL, '1bd83ae9-1e8a-4fc1-8dce-084fbc9a4bd5');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('fb6acdb9-e2f6-4047-ab9b-7120f1479d79', '2017-12-19 03:10:07.629602+03', 'getIdentInfoQuery', '{"code":"79173413853","api_key":""}', NULL, '1bd83ae9-1e8a-4fc1-8dce-084fbc9a4bd5');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('5879ffbd-c2ba-409a-9ac6-f41c46a031e5', '2017-12-19 03:10:07.630611+03', 'getIdentInfoBody', '{}', NULL, '1bd83ae9-1e8a-4fc1-8dce-084fbc9a4bd5');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('dbf93e8b-dcfc-467d-bf9d-01658d0e290a', '2017-12-19 03:10:07.634164+03', 'getIdentInfo result', '{"error_code":"666001","error_text":"no such active token"}', NULL, '1bd83ae9-1e8a-4fc1-8dce-084fbc9a4bd5');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('8895ff78-19d3-4e5e-a4e3-1f9a810d7bc0', '2017-12-19 03:17:39.367727+03', 'getIdentInfoQuery', '{"code":"79173413853"}', NULL, 'ad0cceed-080f-4164-a065-dbaf31a83231');
INSERT INTO data_log (id, dts, action, data, "user", token) VALUES ('d286b42d-53a0-4f97-97a4-aabeb9ed3495', '2017-12-19 03:17:39.366703+03', 'getIdentInfo', '{"code":"79173413853"}', NULL, 'ad0cceed-080f-4164-a065-dbaf31a83231');


--
-- Data for Name: ref_rpt_dataset_params; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_rpt_dataset_params (id, name, query, "default", dataset_id, state, dts, object_id, kind, sys_name) VALUES ('acbda1fa-b6e7-41e0-8e46-125821f324ad', 'Строка', NULL, 'какой то текст', '5d1193da-80b6-41ee-b42b-2e0cbd4b083b', 0, '2017-12-31 17:17:12.199807+03', NULL, 'text', 'text1');
INSERT INTO ref_rpt_dataset_params (id, name, query, "default", dataset_id, state, dts, object_id, kind, sys_name) VALUES ('be003db4-d98e-4145-bb45-0c1f9562576d', 'Дата', '', '', '5d1193da-80b6-41ee-b42b-2e0cbd4b083b', 0, '2017-12-24 01:24:42.255442+03', NULL, 'date', 'date1');


--
-- Data for Name: ref_rpt_datasets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_rpt_datasets (id, name, query, right_id, state, dts, object_id) VALUES ('f9f57185-d632-40bc-b9b6-f13cbefbb0ae', 'other', 'SELECT "id", "dts", "action", "data", "user", "token" FROM "data_log" ', NULL, 0, '2018-01-02 16:02:26.960152+03', NULL);
INSERT INTO ref_rpt_datasets (id, name, query, right_id, state, dts, object_id) VALUES ('5d1193da-80b6-41ee-b42b-2e0cbd4b083b', 'test data set', 'SELECT "id", "dts", "action", "data", "user", "token" FROM "data_log" WHERE "dts" >=TO_DATE($date1,''DD.MM.YYYY'')', NULL, 0, '2017-12-24 01:23:24.282143+03', NULL);


--
-- Data for Name: ref_rpt_report_datasets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_rpt_report_datasets (id, report_id, dataset_id, state, dts, object_id) VALUES ('007c5954-4eac-4331-b752-b1b9356ccd42', '033457b5-fe0f-4321-b615-9f8fcb87a1d3', '5d1193da-80b6-41ee-b42b-2e0cbd4b083b', 0, '2017-12-31 13:59:23.96582+03', NULL);
INSERT INTO ref_rpt_report_datasets (id, report_id, dataset_id, state, dts, object_id) VALUES ('a4218e61-3dca-46e3-89aa-16ae87f75542', '0415d6ef-4c66-40e8-972a-22d570db0c76', 'f9f57185-d632-40bc-b9b6-f13cbefbb0ae', 0, '2018-01-02 16:04:07.050484+03', NULL);


--
-- Data for Name: ref_rpt_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_rpt_reports (id, name, right_id, state, dts, object_id) VALUES ('0415d6ef-4c66-40e8-972a-22d570db0c76', 'status report 1', NULL, 0, '2017-12-24 01:27:42.235888+03', NULL);
INSERT INTO ref_rpt_reports (id, name, right_id, state, dts, object_id) VALUES ('033457b5-fe0f-4321-b615-9f8fcb87a1d3', 'test report', NULL, 0, '2017-12-24 01:27:42.235888+03', NULL);


--
-- Data for Name: ref_rpt_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_rpt_views (id, name, path, maket, report_id, right_id, generator, state, dts, object_id) VALUES ('25b4e951-69e7-49ed-bd18-50f3adab0f4c', 'test view', 'test', NULL, '033457b5-fe0f-4321-b615-9f8fcb87a1d3', '103c5141-ae66-490f-9bce-b485bed10027', 'html', 0, '2017-12-24 01:30:58.038241+03', NULL);
INSERT INTO ref_rpt_views (id, name, path, maket, report_id, right_id, generator, state, dts, object_id) VALUES ('982a3edb-5d09-4241-9842-f065d94dae8b', 'Checklists status', 'test', NULL, '0415d6ef-4c66-40e8-972a-22d570db0c76', '103c5141-ae66-490f-9bce-b485bed10027', 'html', 0, '2017-12-24 01:30:58.038241+03', NULL);


--
-- Data for Name: ref_sys_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ref_sys_menuitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_sys_menuitems (id, name, state, path, icon, right_id, application_id) VALUES ('e1e5b3b7-957f-44fc-ab63-280f60554e2b', 'Reports', 0, '/reports', NULL, 'f0de1824-f91d-42d9-b362-fb0c7be83a4e', '6eb63ba3-5c35-494d-af56-aa1526aa0964');
INSERT INTO ref_sys_menuitems (id, name, state, path, icon, right_id, application_id) VALUES ('11645be1-ddf5-49f4-b96c-da3504433903', 'Users', 0, '/users', NULL, 'b122aafe-7712-4537-96f8-092ea23fb28e', '6eb63ba3-5c35-494d-af56-aa1526aa0964');
INSERT INTO ref_sys_menuitems (id, name, state, path, icon, right_id, application_id) VALUES ('5c4e4612-15ea-423d-a365-2b7287bd47c0', 'Checklists', 0, '/checklists', NULL, '475a92bc-87f5-4192-bd00-c743bf57d0d0', '6eb63ba3-5c35-494d-af56-aa1526aa0964');


--
-- Data for Name: ref_sys_rights; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_sys_rights (id, name, tag, state) VALUES ('103c5141-ae66-490f-9bce-b485bed10027', 'access to application', 'general', 0);
INSERT INTO ref_sys_rights (id, name, tag, state) VALUES ('b122aafe-7712-4537-96f8-092ea23fb28e', 'access to user management', 'users', 0);
INSERT INTO ref_sys_rights (id, name, tag, state) VALUES ('f0de1824-f91d-42d9-b362-fb0c7be83a4e', 'access to reports', 'reports', 0);
INSERT INTO ref_sys_rights (id, name, tag, state) VALUES ('475a92bc-87f5-4192-bd00-c743bf57d0d0', 'access to checklists', 'checklists', 0);


--
-- Data for Name: ref_sys_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_sys_states (id, name) VALUES (0, 'Active');
INSERT INTO ref_sys_states (id, name) VALUES (1, 'Deleted');


--
-- Data for Name: ref_sys_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_sys_users (id, name, pass, state, email, telegram) VALUES ('15f76e83-07d3-4b11-be18-bcbdb5f0cfab', 'admin', 'admin', 0, 'admin@localhost.org', NULL);



--
-- Data for Name: ref_sys_users_x_rights; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO ref_sys_users_x_rights (id, user_id, right_id, state) VALUES ('935024a3-b4ff-40ef-bbac-cef32dc8f943', '15f76e83-07d3-4b11-be18-bcbdb5f0cfab', '103c5141-ae66-490f-9bce-b485bed10027', 0);
INSERT INTO ref_sys_users_x_rights (id, user_id, right_id, state) VALUES ('8155e265-7a4a-49c0-bd1e-7d09b339f4b2', '15f76e83-07d3-4b11-be18-bcbdb5f0cfab', 'b122aafe-7712-4537-96f8-092ea23fb28e', 0);
INSERT INTO ref_sys_users_x_rights (id, user_id, right_id, state) VALUES ('406f103d-3de0-41ed-b851-9b0fb19ad2b6', '15f76e83-07d3-4b11-be18-bcbdb5f0cfab', '475a92bc-87f5-4192-bd00-c743bf57d0d0', 0);
INSERT INTO ref_sys_users_x_rights (id, user_id, right_id, state) VALUES ('b5c33cc4-d000-4504-a027-376f0b8a84a6', '15f76e83-07d3-4b11-be18-bcbdb5f0cfab', 'f0de1824-f91d-42d9-b362-fb0c7be83a4e', 0);


--
-- Name: data_checklist_content data_checklist_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY data_checklist_content
    ADD CONSTRAINT data_checklist_content_pkey PRIMARY KEY (id);


--
-- Name: data_checklists data_checklists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY data_checklists
    ADD CONSTRAINT data_checklists_pkey PRIMARY KEY (id);


--
-- Name: ref_sys_menuitems ef_sys_menuitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_menuitems
    ADD CONSTRAINT ef_sys_menuitems_pkey PRIMARY KEY (id);


--
-- Name: ref_rpt_dataset_params ref_rpt_dataset_params_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_dataset_params
    ADD CONSTRAINT ref_rpt_dataset_params_pkey PRIMARY KEY (id);


--
-- Name: ref_rpt_datasets ref_rpt_datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_datasets
    ADD CONSTRAINT ref_rpt_datasets_pkey PRIMARY KEY (id);


--
-- Name: ref_rpt_report_datasets ref_rpt_report_datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_report_datasets
    ADD CONSTRAINT ref_rpt_report_datasets_pkey PRIMARY KEY (id);


--
-- Name: ref_rpt_reports ref_rpt_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_reports
    ADD CONSTRAINT ref_rpt_reports_pkey PRIMARY KEY (id);


--
-- Name: ref_rpt_views ref_rpt_views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_views
    ADD CONSTRAINT ref_rpt_views_pkey PRIMARY KEY (id);


--
-- Name: ref_sys_applications ref_sys_application_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_applications
    ADD CONSTRAINT ref_sys_application_pk PRIMARY KEY (id);


--
-- Name: ref_sys_rights ref_sys_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_rights
    ADD CONSTRAINT ref_sys_rights_pkey PRIMARY KEY (id);


--
-- Name: ref_sys_states ref_sys_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_states
    ADD CONSTRAINT ref_sys_states_pkey PRIMARY KEY (id);


--
-- Name: ref_sys_users ref_sys_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_users
    ADD CONSTRAINT ref_sys_users_pkey PRIMARY KEY (id);


--
-- Name: ref_sys_users_x_rights ref_sys_users_x_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_users_x_rights
    ADD CONSTRAINT ref_sys_users_x_rights_pkey PRIMARY KEY (id);


--
-- Name: tmp_sys_sessions tmp_sys_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tmp_sys_sessions
    ADD CONSTRAINT tmp_sys_sessions_pkey PRIMARY KEY (id);


--
-- Name: ref_sys_users_x_rights user_right_constraint; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_sys_users_x_rights
    ADD CONSTRAINT user_right_constraint UNIQUE (user_id, right_id);


--
-- Name: user_right; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_right ON ref_sys_users_x_rights USING btree (user_id, right_id);


--
-- Name: data_checklist_content lnk_data_checklists_data_checklist_content; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY data_checklist_content
    ADD CONSTRAINT lnk_data_checklists_data_checklist_content FOREIGN KEY (checklist_id) REFERENCES data_checklists(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ref_rpt_dataset_params lnk_ref_rpt_datasets_ref_rpt_dataset_params; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_dataset_params
    ADD CONSTRAINT lnk_ref_rpt_datasets_ref_rpt_dataset_params FOREIGN KEY (dataset_id) REFERENCES ref_rpt_datasets(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ref_rpt_report_datasets lnk_ref_rpt_datasets_ref_rpt_report_datasets; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_report_datasets
    ADD CONSTRAINT lnk_ref_rpt_datasets_ref_rpt_report_datasets FOREIGN KEY (dataset_id) REFERENCES ref_rpt_datasets(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ref_rpt_report_datasets lnk_ref_rpt_reports_ref_rpt_report_datasets; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_report_datasets
    ADD CONSTRAINT lnk_ref_rpt_reports_ref_rpt_report_datasets FOREIGN KEY (report_id) REFERENCES ref_rpt_reports(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ref_rpt_views lnk_ref_rpt_reports_ref_rpt_views; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ref_rpt_views
    ADD CONSTRAINT lnk_ref_rpt_reports_ref_rpt_views FOREIGN KEY (report_id) REFERENCES ref_rpt_reports(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

