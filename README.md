# Display Advertising Utils


## 💻 Requirements and install

- [NodeJS](https://nodejs.org/en/) (8 or greater)

```bash
npm install -g dau
```


## 	⌨️ Usage

```bash
dau <command> [option]
```

### Commands

* **help**: Print help info.                                                                     
* **qa**: Search for .zip files in a directory and return the result of banner validation.
* **repos**: Get the versions of all the repositories inside GitHub Media.Monks DisplayAd.
* **bannerToVideo**: Easily export GreenSock (GSAP) animation to video.
* **compressImages**: Minify size your images. Image compression with extension: jpg/jpeg, svg, png, gif.

### Options

* **--clear**: Clear the console.
* **--noClear**: Don't clear the console.
* **--debug**: Print debug info.
* **--version**: Print CLI version.
* **--assetType**: Type of the asset ('adwords' or 'dcm') to validate.


## 📚 Examples

Validate the banners from a directory, run the following command:

```bash
dau qa --assetType dcm
```

Get the information about the repositories inside DisplayAd:
```bash
dau repos
```