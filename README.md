# Checklists
Simple checklist application for QA/testing purposes

(basic features implemented, pre-production, a lot of work has to be done)

## General workflow


## installation

* git clone
* npm install
* create database "checklists" with 'db/createdb.sql'
* if you have non-defult postgresql credentials - fix it in 'config/config.js'


## TODO
* Reporting
- [ ] only one dataset per report is available now, while database structure allows to attach several datasets to one report. Reports/index.js getViewSingleDS should be replaced by getView when getView is fixed.
- [ ] the report template name shall be taken from 'maket' property of the view.

* Checklists
- [ ] Complete process feature
