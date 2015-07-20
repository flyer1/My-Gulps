# My-Gulps [![devDependency Status](https://img.shields.io/david/dev/flyer1/My-Gulps.svg?style=flat)](https://david-dm.org/flyer1/My-Gulps#info=devDependencies) 

A clean, maintainable, easy to grok GULP framework. This is a structure that you can use in your projects when you have many gulp tasks and want to keep them in a clean state. B/c no one loves to maintain a massive gulpfile.js.

## Sample Gulp Task - photos
Takes a source folder that contains a bunch of photos and moves them to different folders based upon creation date of each photo. The folder structure used is /YYYY/MM. So for eg, ~/Pictures/2015/07/IMG_9182.jpg. 

## Get Started

#### 1. Clone the Repository
From Command line:

```
git clone https://github.com/flyer1/My-Gulps.git
```


Or use GitHub for Windows or GitHub for Mac (my preferred approach).

#### 2. Get NPM Packages
Get the node modules required to run these gulp tasks.

```
npm install
```
(on a mac, you may have to prepend this line with 'sudo' to run as admin)

#### 3. Run the Tasks

Run the default task (displays 'help' task):

```
gulp
```

Or run a task by name:

```
gulp photos
```