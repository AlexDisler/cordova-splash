var fs     = require('fs');
var path   = require('path');
var xml2js = require('xml2js');
var ig     = require('imagemagick');
var colors = require('colors');
var _      = require('underscore');
var Q      = require('q');
var wrench = require('wrench');
var optparse = require('optparse');

/**
 * Check which platforms are added to the project and return their splash screen names and sizes
 *
 * @param  {String} projectName
 * @return {Promise} resolves with an array of platforms
 */
var getPlatforms = function (projectName) {
  var deferred = Q.defer();
  var platforms = [];
  platforms.push({
    name : 'ios',
    // TODO: use async fs.exists
    isAdded : fs.existsSync('platforms/ios'),
    splashPath : (settings.RESOURCE_PATH + '/' + settings.SCREEN_DIR + '/ios/').replace('//', '/'),
    platformSplashPath : 'platforms/ios/' + projectName + '/Resources/splash/',
    splash : [
      // iPhone
      { name: 'Default~iphone.png',            width: 320,  height: 480  },
      { name: 'Default@2x~iphone.png',         width: 640,  height: 960  },
      { name: 'Default-568h@2x~iphone.png',    width: 640,  height: 1136 },
      { name: 'Default-667h.png',              width: 750,  height: 1334 },
      { name: 'Default-736h.png',              width: 1242, height: 2208 },
      { name: 'Default-Landscape-736h.png',    width: 2208, height: 1242 },
      // iPad
      { name: 'Default-Portrait~ipad.png',     width: 768,  height: 1024 },
      { name: 'Default-Portrait@2x~ipad.png',  width: 1536, height: 2048 },
      { name: 'Default-Landscape~ipad.png',    width: 1024, height: 768  },
      { name: 'Default-Landscape@2x~ipad.png', width: 2048, height: 1536 }
    ]
  });
  platforms.push({
    name : 'android',
    isAdded : fs.existsSync('platforms/android'),
    splashPath : (settings.RESOURCE_PATH + '/' + settings.SCREEN_DIR + '/android/').replace('//', '/'),
    platformSplashPath: 'platforms/android/res/',
    splash : [
      // Landscape
      { name: 'drawable-land-ldpi/screen.png',  width: 320,  height: 200  },
      { name: 'drawable-land-mdpi/screen.png',  width: 480,  height: 320  },
      { name: 'drawable-land-hdpi/screen.png',  width: 800,  height: 480  },
      { name: 'drawable-land-xhdpi/screen.png', width: 1280, height: 720  },
      { name: 'drawable-land-xxhdpi/screen.png', width: 1600, height: 960  },
      { name: 'drawable-land-xxxhdpi/screen.png', width: 1920, height: 1280  },
      // Portrait
      { name: 'drawable-port-ldpi/screen.png',  width: 200,  height: 320  },
      { name: 'drawable-port-mdpi/screen.png',  width: 320,  height: 480  },
      { name: 'drawable-port-hdpi/screen.png',  width: 480,  height: 800  },
      { name: 'drawable-port-xhdpi/screen.png', width: 720,  height: 1280 },
      { name: 'drawable-port-xxhdpi/screen.png', width: 960, height: 1600  },
      { name: 'drawable-port-xxxhdpi/screen.png', width: 1280, height: 1920  }
    ]
  });
  if (settings.WINDOWS) {
    platforms.push({
      name : 'windows',
      isAdded : fs.existsSync('platforms/windows'),
      splashPath :(settings.RESOURCE_PATH + '/' + settings.SCREEN_DIR + '/windows/').replace('//', '/'),
      platformSplashPath: 'platforms/windows/images/',
      splash : [
        { name: 'SplashScreen.scale-100.png', width: 620,  height: 300  },
        { name: 'SplashScreen.scale-125.png', width: 775,  height: 375  },
        { name: 'SplashScreen.scale-150.png', width: 930,  height: 450  },
        { name: 'SplashScreen.scale-200.png', width: 1240, height: 600  },
        { name: 'SplashScreen.scale-400.png', width: 2480, height: 1200 }
      ]
    });
  }
  deferred.resolve(platforms);
  return deferred.promise;
};


/**
 * @var {Object} settings - names of the config file and of the splash image
 * TODO: add option to get these values as CLI params
 */
var settings = {};
settings.CONFIG_FILE = 'config.xml';
settings.SPLASH_FILE   = 'splash.png';
settings.RESOURCE_PATH = 'config/res'; // without trailing slash
settings.SCREEN_DIR = 'screen'; // without slashes
settings.USE_PLATFORMS_PATH = false; // true to use platforms path
settings.WINDOWS = false; // build windows splashes

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};

/**
 * read the config file and get the project name
 *
 * @return {Promise} resolves to a string - the project's name
 */
var getProjectName = function () {
  var deferred = Q.defer();
  var parser = new xml2js.Parser();
  data = fs.readFile(settings.CONFIG_FILE, function (err, data) {
    if (err) {
      deferred.reject(err);
    }
    parser.parseString(data, function (err, result) {
      if (err) {
        deferred.reject(err);
      }
      var projectName = result.widget.name[0];
      deferred.resolve(projectName);
    });
  });
  return deferred.promise;
};

/**
 * Crops and creates a new splash in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} splash
 * @return {Promise}
 */
var generateSplash = function (platform, splash) {
  var deferred = Q.defer();
  var srcPath = settings.SPLASH_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = (settings.USE_PLATFORMS_PATH ?
	platform.platformSplashPath : platform.splashPath) + splash.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    wrench.mkdirSyncRecursive(dst);
  }
  ig.crop({
    srcPath: srcPath,
    dstPath: dstPath,
    quality: 1,
    format: 'png',
    width: splash.width,
    height: splash.height
  } , function(err, stdout, stderr){
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
      display.success(splash.name + ' created [' + dstPath + ']');
    }
  });
  return deferred.promise;
};

/**
 * Generates splash based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateSplashForPlatform = function (platform) {
  var deferred = Q.defer();
  display.header('Generating splash screen for ' + platform.name);
  var all = [];
  var splashes = platform.splash;
  splashes.forEach(function (splash) {
    all.push(generateSplash(platform, splash));
  });
  Q.all(all).then(function () {
    deferred.resolve();
  }).catch(function (err) {
    console.log(err);
  });
  return deferred.promise;
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateSplashes = function (platforms) {
  var deferred = Q.defer();
  var sequence = Q();
  var all = [];
  _(platforms).forEach(function (platform) {
    sequence = sequence.then(function () {
      return generateSplashForPlatform(platform);
    });
    all.push(sequence);
  });
  Q.all(all).then(function () {
    deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Checks if at least one platform was added to the project
 *
 * @return {Promise} resolves if at least one platform was found, rejects otherwise
 */
var atLeastOnePlatformFound = function () {
  var deferred = Q.defer();
  getPlatforms().then(function (platforms) {
    var activePlatforms = _(platforms).where({ isAdded : true });
    if (activePlatforms.length > 0) {
      display.success('platforms found: ' + _(activePlatforms).pluck('name').join(', '));
      deferred.resolve();
    } else if (!settings.USE_PLATFORMS_PATH) {
      deferred.resolve();
    } else {
      display.error('No cordova platforms found. Make sure you are in the root folder of your Cordova project and add platforms with \'cordova platform add\'');
      deferred.reject();
    }
  });
  return deferred.promise;
};

/**
 * Checks if a valid splash file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validSplashExists = function () {
  var deferred = Q.defer();
  fs.exists(settings.SPLASH_FILE, function (exists) {
    if (exists) {
      display.success(settings.SPLASH_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error(settings.SPLASH_FILE + ' does not exist in the root folder');
      deferred.reject();
    }
  });
  return deferred.promise;
};

/**
 * Checks if a config.xml file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var configFileExists = function () {
  var deferred = Q.defer();
  fs.exists(settings.CONFIG_FILE, function (exists) {
    if (exists) {
      display.success(settings.CONFIG_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error('cordova\'s ' + settings.CONFIG_FILE + ' does not exist in the root folder');
      deferred.reject();
    }
  });
  return deferred.promise;
};

/**
 * parse command line options
 */
var parseOptions = function() {
  var switches = [
     ['-h', '--help', 'Show this help'],
     ['-p', '--path PATH', 'resource path, defaults to ' + settings.RESOURCE_PATH],
     ['-s', '--screen DIR', 'screen directory in PATH, defaults to ' + settings.SCREEN_DIR],
     ['-c', '--compat', 'uses default path in platforms (backwards compatibility, overrides -p and -i)'],
     ['-w', '--windows', 'generate windows icons as well, will not by default.'],
  ];
  var parser = new optparse.OptionParser(switches);
  parser.on('help', function() {
	console.log(parser.toString());
	process.exit();
  });
  parser.on('path', function(opt, path) {
	settings.RESOURCE_PATH = path;
  });
  parser.on('screen', function(opt, path) {
	settings.SCREEN_DIR = path;
  });
  parser.on('compat', function() {
	settings.USE_PLATFORMS_PATH = true;
  });
  parser.on('windows', function() {
    settings.WINDOWS = true;
  });
  parser.parse(process.argv);
}

parseOptions();

display.header('Checking Project & Splash');

atLeastOnePlatformFound()
.then(validSplashExists)
.then(configFileExists)
.then(getProjectName)
.then(getPlatforms)
.then(generateSplashes)
.catch(function (err) {
  if (err) {
    console.log(err);
  }
}).then(function () {
  console.log('');
});
