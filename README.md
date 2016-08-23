# cordova-splash

Automatic splash screen generator for Cordova. Create a splash screen (2208x2208) once in the root folder of your Cordova project and use cordova-splash to automatically crop and copy it for all the platforms your project supports (currenty works with iOS, Android and Windows 10).

### Installation

    $ sudo npm install cordova-splash -g

### Requirements

- ImageMagick installed (*Mac*: `brew install imagemagick`, *Debian/Ubuntu*: `sudo apt-get install imagemagick`, *Windows*: [See here](http://www.imagemagick.org/script/binary-releases.php#windows))
- At least one platform was added to your project ([cordova platforms docs](http://cordova.apache.org/docs/en/edge/guide_platforms_index.md.html#Platform%20Guides))
- Cordova's config.xml file must exist in the root folder ([cordova config.xml docs](http://cordova.apache.org/docs/en/edge/config_ref_index.md.html#The%20config.xml%20File))

### Usage

Create a `splash.png` file in the root folder of your cordova project and run:

    $ cordova-splash
    
You may specify the output path and directory as follows:

    # output to path/to/res/screen
    $ cordova-splash -p path/to/res -s screen
    
WARNING: If you were using a previous version of cordova-splash and expect the generated files to be in their respective ./platforms
path, use the compability mode:

    $ cordova-splash -c
    
This will override the -p and -s settings.
    

### Icons

Check out [cordova-icon](https://github.com/AlexDisler/cordova-icon)

### License

MIT
