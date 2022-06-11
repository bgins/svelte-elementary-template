# Svelte Elementary Template 

Svelte Elementary Template is a template for building [Elementary Audio](https://www.elementary.audio/) web apps.

Features include:

- ⚡ **Audio Engine.** Elementary + Web Audio core engine.
- ✨ **Starter synth.** A simple synth with pan and gain controls.
- 🎹 **MIDI and Keyboard controllers.** Play the synth with your computer keyboard or MIDI device.
- 🎛️ **Knobs.** [webaudio-controls](https://g200kg.github.io/webaudio-controls/docs/index.html) unipolar and bipolar knobs with a custom knob component.
- 🌒 **Dark and Light Themes.** Built with [daisyUI](https://daisyui.com/). Includes default dark and light themes.
- 💻 **App publishing with Fission.** Publish your app to the web in a few simple steps.

## Setup

Install dependencies.

```shell
npm install
```

## Develop

Work on the application in local development.

```shell
npm run dev
```

Navigate to `localhost:3000` in your web browser.

## Build

Export a static build.

```shell
npm run build
```

The build outputs the static site to the `build` directory.

## Customize

Update `src/app.html` with your title and social preview tags. Replace the social preview image `static/preview.png` with a preview image for your app.

## Publish

The built site publishes with the [Fission CLI](https://guide.fission.codes/developers/cli) and the [Fission GH publish action](https://github.com/fission-suite/publish-action). Publishing from the command line is configured in [fission.yaml](fission.yaml), and the GitHub publish action is configured in [publish.yml](.github/workflows/publish.yml).

To configure your own CLI publishing:

1. [Install the Fission CLI](https://guide.fission.codes/developers/installation)
2. Run `fission setup` to make a Fission account
3. Run `npm run build` to build the app
4. Delete `fission.yaml`
5. Run `fission app register` to register a new Fission app (accept the `./build` directory suggestion for your build directory)
6. Run `fission app publish` to publish your app to the web

After publishing, your app will be available online at the domain assigned by the register command.

To set up the GitHub publish action:

1. Export your machine key with `base64 ~/.config/fission/key/machine_id.ed25519`
2. Add your machine key as a GH Repository secret named `FISSION_MACHINE_KEY`
2. Update the `publish.yml` with the name of your registered app

See the [Fission Guide](https://guide.fission.codes/developers/installation) and the publish action README for more details.

## License

The source code for this template is available under the Apache 2.0 license. Please consult the [Elementary License](https://www.elementary.audio/license) for additional instructions on using the Elementary SDK.