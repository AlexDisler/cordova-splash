# cordova-splash + capacitor-splash = c2-splash

Automatic splash screen generator for *both* [Cordova](https://cordova.apache.org) and [capacitor](https://capacitor.ionicframework.com/); that's why I renamed it to *c2-splash*. :-P

Create a splash screen once in the root folder of your Cordova / capacitor project and use c2-splash to automatically crop and copy it for all the platforms your project supports (currently works with iOS, Android and Windows 10 (Cordova only)).

### Installation

    $ sudo npm install cordova-splash -g

If you are using an older version of cordova (before 7.x):

    $ sudo npm install cordova-splash@0.12.0 -g

### Requirements

- ImageMagick installed (*Mac*: `brew install imagemagick`, *Debian/Ubuntu*: `sudo apt-get install imagemagick`, *Windows*: [See here](https://www.imagemagick.org/script/download.php#windows), when installing choose the "Legacy tools" option!)
- At least one platform was added to your project ([cordova platforms docs](http://cordova.apache.org/docs/en/edge/guide_platforms_index.md.html#Platform%20Guides) or (`npx cap add`)[https://capacitor.ionicframework.com/docs/getting-started/])
- Cordova's config.xml file must exist in the root folder ([cordova config.xml docs](http://cordova.apache.org/docs/en/edge/config_ref_index.md.html#The%20config.xml%20File)), or, when using capacitor, it looks for `capacitor.config.json`

### Usage

Create a `splash.png` file with in the root folder of your cordova project. The splash screen image should be **2208x2208 px** with a center square of about **1200x1200 px**. The image may be **cropped** around the center square. You can also use larger images with similar proportions. As ImageMagick is used for image generation, you can also use SVG graphics.

Then run:

    $ c2-splash

c2-splash automatically detects whether you have a cordova or a capacitor project by looking for the `capacitor.config.json` config file.

You also can specify manually a location for your `config.xml` / `capacitor.config.json` or `splash.png`:

    $ c2-splash --config=config.xml --splash=splash.png

You can use the `--capacitor` option to manually choose "capacitor" mode and use `--config` to set the file name.

If you run a old version of Cordova for iOS and you need your files in `/Resources/icons/`, use this option:

    $ c2-splash --xcode-old

To change the output filename for android, use:

    $ c2-splash --android_filename=screen.png

#### Notes:

- The error message `Error: spawn identify ENOENT` is printed, when the script cannot find the `identify` tool, i.e. the ImageMagick tools are not found in `PATH`.
- There are sample splash images to help you see which parts are visible in which resolution: sample.svg / sample.png

**Cordova:**

- Your `config.xml` file will not be updated by the tool (because images are automatically created in the good folders)
- Therefore, in your `config.xml`, be sure to remove all lines looking like `<splash src="res/screen/android/splash-land-mdpi.png" density="land-mdpi"/>`

**capacitor:**

- For android and ios the splash images are generated in the platform directory where they are expected for building the app. *However, as I don't have a Mac at hand right now, I didn't test the paths for ios.*

### Icons

Check out [cordova-icon](https://github.com/AlexDisler/cordova-icon)

### License

MIT
