# Checklists
Simple checklist application for QA/testing purposes

(basic features implemented, pre-production, a lot of work has to be done)

## General workflow


## installation

* git clone
* npm install
* create empty database "checklists" and run app
* if you have non-defult postgresql credentials - fix it in 'config_/config.json'


## TODO

* Installation
- [ ] add database create or update feature on application startup
- [ ] move settings to json file 
- [ ] add a seting to undersrand whether it’s a new installation or not (for proper upgrade)
- [ ] if a new installation - run setup dialog

* Reporting
- [ ] only one dataset per report is available now, while database structure allows to attach several datasets to one report. Reports/index.js getViewSingleDS should be replaced by getView when getView is fixed.
- [ ] the report template name shall be taken from 'maket' property of the view.

* Checklists
- [ ] Complete process feature
