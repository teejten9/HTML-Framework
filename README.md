# HTML Framework
### By Stew Dellow | [hellostew.com](http://hellostew.com/ "Creative Web Developer")

## About
A Grunt powered HTML Framework utilising SASS and RequireJS.

## Install
After cloning the repository simply run from your command line:

	bash ./clean
This will remove the Git wrapper and replace with a fresh Git initialisation and remove any un-necessary files/directories. All JavaScript to be added in /app and /helpers - this will be compiled by Grunt into a global build.js file.

## Usage
* Run the default config in development mode

		grunt
* Run the production config production mode

		grunt prod
* Watch for changes to the main JS and SASS files

		grunt watch
* Compile SASS once

		grunt compass

## Changelog
*  `v. 1.1.0`
