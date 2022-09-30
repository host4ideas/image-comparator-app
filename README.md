# Build Your First Ionic App: Photo Gallery (Ionic Vue and Capacitor)

Get started with Ionic by building a photo gallery app that runs on iOS, Android, and the web - with just one codebase. This is the complete project referenced in the ["Your First App: Vue" guide](https://ionicframework.com/docs/vue/your-first-app). Follow along to create a complete CRUD (create-read-update-delete) experience.

Powered by [Ionic Vue](https://ionicframework.com/docs/vue/overview) (web app) and [Capacitor](https://capacitorjs.com) (native app runtime).

## How It Works

After the user navigates to Tab 2 (Photos), they can tap/click on the camera button to open up the device's camera. After taking or selecting a photo, it's stored permanently into the device's filesystem. When the user reopens the app at a later time, the photo images are loaded from the filesystem and displayed again in the gallery. The user can tap on a photo to be presented with the option to remove the photo.

## Feature Overview

* App framework: [Vue](https://vuejs.org/)
* UI components: [Ionic Framework](https://ionicframework.com/docs/components)
  * Camera button: [Floating Action Button (FAB)](https://ionicframework.com/docs/api/fab)
  * Photo Gallery display: [Grid](https://ionicframework.com/docs/api/grid)
  * Delete Photo dialog: [Action Sheet](https://ionicframework.com/docs/api/action-sheet) 
* Native runtime: [Capacitor](https://capacitorjs.com)
  * Taking photos: [Camera API](https://capacitorjs.com/docs/apis/camera)
  * Writing photo to the filesystem: [Filesystem API](https://capacitorjs.com/docs/apis/filesystem)
  * Storing photo gallery metadata: [Preferences API](https://capacitorjs.com/docs/apis/preferences)

## Project Structure

* Tab2 (Photos) (`src/views/Tab2.vue`): Photo Gallery UI and basic logic.
* usePhotoGallery Hook (`src/composables/usePhotoGallery.ts`): Logic encapsulating Capacitor APIs, including Camera, Filesystem, and Preferences.

## How to Run

> Note: It's highly recommended to follow along with the [tutorial guide](https://ionicframework.com/docs/vue/your-first-app), which goes into more depth, but this is the fastest way to run the app. 

0) Install Ionic if needed: `npm install -g @ionic/cli`.
1) Clone this repository.
2) In a terminal, change directory into the repo: `cd photo-gallery-capacitor-vue`.
3) Install all packages: `npm install`.
4) Run on the web: `ionic serve`.
5) Run on iOS or Android: See [here](https://ionicframework.com/docs/building/running).

## How to build

0) Add android if needed: `ionic capacitor add android` or `ionic capacitor add ios`.
1) With each change Ionic apps must be built into web assets: `ionic capacitor copy android` or `ionic capacitor copy ios`.
2) With each change Ionic apps must be built into web assets: `ionic capacitor build android` or `ionic capacitor build ios`.

> If you have [Android Studio](https://developer.android.com/studio) installed, step 2 will open it up to debug your app.
