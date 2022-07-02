/**
 * @name EmoteSizes
 * @invite VbkxFyyjkv
 * @authorLink https://github.com/ssense1337
 * @donate https://shop.hamhot.com/
 * @website https://hamhot.com/
 * @source https://github.com/ssense1337/DiscordAddons/raw/master/EmoteSizes/EmoteSizes.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"EmoteSizes","inviteCode":"VbkxFyyjkv","authorLink":"https://github.com/ssense1337","paypalLink":"https://shop.hamhot.com/","github":"https://hamhot.com/","github_raw":"https://github.com/ssense1337/DiscordAddons/raw/master/EmoteSizes/EmoteSizes.plugin.js","authors":[{"name":"ssense","discord_id":"146080957965795328","github_username":"ssense1337"}],"version":"1.0.0","description":"You can hover your mouse over the emoji to zoom?"},"changelog":[{"title":"Improvements","type":"improved","items":["You can hover your mouse over the emoji to zoom?"]}],"main":"index.js","defaultConfig":[{"name":"Affect small emojis","type":"switch","id":"alterSmall","value":true},{"name":"Default small emoji size (px)","type":"textbox","id":"smallSize","value":"22"},{"name":"Affect large emojis","type":"switch","id":"alterLarge","value":true},{"name":"Default large emoji size (px)","type":"textbox","id":"largeSize","value":"38.4"},{"name":"Affect reactions","type":"switch","id":"alterReactions","value":true},{"name":"Default reaction size (px)","type":"textbox","id":"reactionSize","value":"16"},{"name":"Emoji hover size multiplier","type":"textbox","id":"hoverSize","value":"1.25"},{"name":"Reaction hover size multiplier","type":"textbox","id":"reactionHoverSize","value":"1.05"},{"name":"Transition speed (seconds)","type":"textbox","id":"transitionSpeed","value":"0.5"},{"name":"Delay amount (seconds)","type":"textbox","id":"delayAmount","value":"0"},{"name":"Small and large emote zoom to equal","type":"switch","id":"equal","value":true}]};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
    const { WebpackModules, Toasts, PluginUtilities } = Library;

    let _this;

    return class SpoofStreamPreview extends Plugin {
        onStart() {
            _this = this;

            this.updateStyles();
        }

        getClass = (arg, thrw) => {
            try {
                const args = arg.split(' ');
                return WebpackModules.getByProps(...args)[args[args.length - 1]];
            } catch (e) {
                if (thrw) throw e;
                return '';
            }
        }

        updateStyles() {
            const markup = this.getClass("markup"), markupRtl = this.getClass("markupRtl"), messageGroup = this.getClass("cozyMessage"), message = this.getClass("message"), reaction = this.getClass("reaction"), reactionMe = this.getClass("reactionMe");

            PluginUtilities.removeStyle(this.getName());

            let css = `.${messageGroup} { overflow: visible; z-index: unset!important; } #app-mount .${markup}, #app-mount .${markupRtl} {overflow: visible;}`;

            if (this.settings.alterSmall) {
                css = css + `
                    #app-mount .${markup} .emoji:not(.jumboable),
                    #app-mount .${markupRtl} .emoji:not(.jumboable) {
                        min-height: unset;
                        height: auto;
                        width: ${this.settings.smallSize}px;
                        transform: scale(1);
                        transition: transform ${this.settings.transitionSpeed}s;
                        transition-delay: 0s;
                    }
                    #app-mount .${markup} .emoji:not(.jumboable):hover,
                    #app-mount .${markupRtl} .emoji:not(.jumboable):hover {
                        transform: scale(${this.settings.equal ? this.settings.hoverSize : ((this.settings.largeSize / this.settings.smallSize) * this.settings.hoverSize)});
                        z-index: 1;
                        transition-delay: ${this.settings.delayAmount}s;
                    }
                    #app-mount .${messageGroup}:last-child .${message}:nth-last-child(2) .${markup} .emoji:not(.jumboable):hover,
                    #app-mount .${messageGroup}:last-child .${message}:nth-last-child(2) .${markupRtl} .emoji:not(.jumboable):hover {
                        transform: scale(${this.settings.equal ? ((this.settings.largeSize / this.settings.smallSize) * this.settings.hoverSize) : this.settings.hoverSize}) translateY(-35%);
                    }
			    `;
            }

            if (this.settings.alterLarge) {
                css = css + `
                    #app-mount .${markup} .emoji.jumboable,
                    #app-mount .${markupRtl} .emoji.jumboable {
                        height: auto;
                        width: ${this.settings.largeSize}px;
                        transform: scale(1);
                        transition: transform ${this.settings.transitionSpeed}s;
                        transition-delay: 0s;
                    }
                    #app-mount .${markup} .emoji.jumboable:hover,
                    #app-mount .${markupRtl} .emoji.jumboable:hover {
                        transform: scale(${this.settings.hoverSize});
                        z-index: 1;
                        transition-delay: ${this.settings.delayAmount}s;
                    }
                    #app-mount .${messageGroup}:last-child .${message}:nth-last-child(2) .${markup} .emoji.jumboable:hover,
                    #app-mount .${messageGroup}:last-child .${message}:nth-last-child(2) .${markupRtl} .emoji.jumboable:hover {
                        transform: scale(${this.settings.hoverSize}) translateY(-35%);
                    }
                `;
            }

            if (this.settings.alterReactions) {
                css = css + `
                    #app-mount .${reaction} .emoji, .${reaction}.${reactionMe} .emoji {
                        height: ${this.settings.reactionSize}px;
                        width: auto;
                    }
                    #app-mount .${reaction} {
                        transition: transform ${this.settings.transitionSpeed}s;
                        transition-delay: 0s;
                    }
                    #app-mount .${reaction}:hover {
                        transform: scale(${this.settings.reactionHoverSize}) !important;
                        z-index: 1000;
                        transition-delay: ${this.settings.delayAmount}s;
                    }
                `;
            }

            PluginUtilities.addStyle(this.getName(), css);
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

        updateSettings(id, value) {
            if (id.endsWith('Size') || ['hoverSize', 'reactionHoverSize', 'transitionSpeed', 'delayAmount'].includes(id)) {
                if (isNaN(value)) return Toasts.error('Value must be a number!');
            }
            this.updateStyles();
        }
    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
