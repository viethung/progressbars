1/ Run npm install to install gruntjs modules
2/ Run grunt inside progressbars folder for automate process

Following feature has been developed:

· Multiple bars
· One set of controls that can control each bar on the fly
· Can't go under 0
· Can go over 100, but limit the bar itself and change its colour
· Display usage amount, centered
· Consider animating the bar change
· Consider linear gradient for the bar -> Not implemented
· Consider a responsive solution: testing it on mobile, tablet, etc. Getting it working nicely.
· Publish your code online somewhere: github or something like plnkr.co, jsfiddle.net

Bonus points for implementing "production quality" code, using practices such as:
· Setting it up as a project
· Setting up some automated tools -> using gruntjs
· Writing tests for your code (TDD would be nice) -> test file is inside test folder
· Version control (git)
· Linting, code quality, etc - using IDE builtin Linting
· JavaScript/CSS minification, packaging, etc   -> using gruntjs htmlmin and cssmin modules
· Using a CSS preprocessor like SASS/SCSS   -> Using IDE builtin SASS watch and compile to css on the fly