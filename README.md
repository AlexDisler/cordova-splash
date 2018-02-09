# cordova-splash

Automatic splash screen generator for Cordova. Create a splash screen once in the root folder of your Cordova project and use cordova-splash to automatically crop and copy it for all the platforms your project supports (currenty works with iOS, Android and Windows 10).

The splash screen image should be 2208x2208 px with a center square of about 1200x1200 px. The image may be cropped around the center square. You can also use larger images with similar proportions.

### Installation

    $ sudo npm install cordova-splash -g

If you are using an older version of cordova (before 7.x):

    $ sudo npm install cordova-splash@0.12.0 -g

### Requirements

- ImageMagick installed (*Mac*: `brew install imagemagick`, *Debian/Ubuntu*: `sudo apt-get install imagemagick`, *Windows*: [See here, install "Legacy tools"](http://www.imagemagick.org/script/binary-releases.php#windows))
- At least one platform was added to your project ([cordova platforms docs](http://cordova.apache.org/docs/en/edge/guide_platforms_index.md.html#Platform%20Guides))
- Cordova's config.xml file must exist in the root folder ([cordova config.xml docs](http://cordova.apache.org/docs/en/edge/config_ref_index.md.html#The%20config.xml%20File))

### Usage

Create a `splash.png` file in the root folder of your cordova project and run:

    $ cordova-splash

You also can specify manually a location for your `config.xml` or `splash.png`:

    $ cordova-splash --config=config.xml --splash=splash.png

If you run a old version of Cordova for iOS and you need your files in `/Resources/icons/`, use this option:

    $ cordova-splash --xcode-old

#### Notes:

- Your `config.ml` file will not be updated by the tool (because images are automatically created in the good folders)
- Therefore, in your `config.xml`, be sure to remove all lines looking like `<splash src="res/screen/android/splash-land-mdpi.png" density="land-mdpi"/>`

### Icons

Check out [cordova-icon](https://github.com/AlexDisler/cordova-icon)

### License

MIT
