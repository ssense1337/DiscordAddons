/**
	* @name DefaultChannel
	* @website https://github.com/ssense1337/DiscordAddons/tree/master/DefaultChannel
	* @source https://raw.githubusercontent.com/ssense1337/DiscordAddons/master/DefaultChannel/DefaultChannel.plugin.js
*/
/*@cc_on
	@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
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
    const config = {info:{name:"DefaultChannel",authors:[{name:"ssense",discord_id:"146080957965795328",github_username:"ssense1337"}],version:"1.0",description:"Switch to a Channel after launching discord.",github:"https://github.com/ssense1337/DiscordAddons/tree/master/DefaultChannel",github_raw:"https://raw.githubusercontent.com/ssense1337/DiscordAddons/master/DefaultChannel/DefaultChannel.plugin.js"},changelog:[{title:"Added",type:"added",items:["Added this Plugin"]}],main:"index.js",defaultConfig:[{type:"textbox",id:"guildId",name:"guildId",value:""},{type:"textbox",id:"channelId",name:"channelId",value:""}]};
	
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
			const plugin = (Plugin, Api) => {
				const {DiscordModules, DiscordSelectors, PluginUtilities, DOMTools, Logger} = Api;
				return class DefaultChannel extends Plugin {
					onStart() {
						DiscordModules.NavigationUtils.transitionTo("/channels/" + this.settings.guildId + "/" + this.settings.channelId);
					}
					
					onStop() {
						
					}
					
					getSettingsPanel() {
						return this.buildSettingsPanel().getElement();
					}
					
				};
			};
			return plugin(Plugin, Api);
		})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
