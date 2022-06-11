(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all2) => {
    for (var name in all2)
      __defProp(target, name, { get: all2[name], enumerable: true });
  };

  // src/wpRequire.ts
  var wpRequire = window["webpackJsonpkaihei-react"].push([
    [],
    {
      get: (m, _2, wpRequire2) => m.exports = wpRequire2
    },
    [["get"]]
  ]);
  window["webpackJsonpkaihei-react"].pop();
  delete wpRequire.m.get;
  delete wpRequire.c.get;
  var wpRequire_default = wpRequire;

  // src/modules/webpack.ts
  var modules = wpRequire_default.c;
  function findAll(filter) {
    let found = [];
    for (const mod in modules) {
      if (modules.hasOwnProperty(mod)) {
        const module = modules[mod].exports;
        if (module === globalThis)
          continue;
        if (module) {
          if (module.default && module.__esModule && filter(module.default))
            found.push(module.default);
          if (filter(module))
            found.push(module);
        }
      }
    }
    return found;
  }
  var webpack = {
    wpRequire: wpRequire_default,
    modules,
    find: (filter) => findAll(filter)[0],
    findAll,
    findByPropsAll: (...props) => findAll((m) => props.every((p) => m[p] !== void 0)),
    findByProps: (...props) => webpack.findByPropsAll(...props)[0],
    findByNestedPropsAll: (...props) => findAll((m) => props.every((p) => Object.keys(m).some((k) => m[k]?.[p] !== void 0)))
  };
  var webpack_default = webpack;

  // src/modules/common.ts
  var bothConstants = webpack_default.findByPropsAll("app_name");
  var EN_APP_NAME = "Kaiheila";
  var common_default = {
    React: webpack_default.findByProps("createElement"),
    lodash: _,
    constantsCN: bothConstants.find((c) => c.app_name !== EN_APP_NAME),
    constantsEN: bothConstants.find((c) => c.app_name === EN_APP_NAME)
  };

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    after: () => after,
    before: () => before,
    instead: () => instead,
    unpatchAll: () => unpatchAll
  });

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/shared.js
  var patchTypes = ["a", "b", "i"];
  var patchedObjects = /* @__PURE__ */ new Map();

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/hook.js
  function hook_default(funcName, funcParent, funcArgs, ctxt, isConstruct) {
    const patch = patchedObjects.get(funcParent)?.[funcName];
    if (!patch)
      return isConstruct ? Reflect.construct(funcParent[funcName], funcArgs, ctxt) : funcParent[funcName].apply(ctxt, funcArgs);
    for (const hook of patch.b.values()) {
      const maybefuncArgs = hook.call(ctxt, funcArgs);
      if (Array.isArray(maybefuncArgs))
        funcArgs = maybefuncArgs;
    }
    let insteadPatchedFunc = (...args) => isConstruct ? Reflect.construct(patch.o, args, ctxt) : patch.o.apply(ctxt, args);
    for (const callback of patch.i.values()) {
      const oldPatchFunc = insteadPatchedFunc;
      insteadPatchedFunc = (...args) => callback.call(ctxt, args, oldPatchFunc);
    }
    let workingRetVal = insteadPatchedFunc(...funcArgs);
    for (const hook of patch.a.values())
      workingRetVal = hook.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
    return workingRetVal;
  }

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/unpatch.js
  function unpatch(funcParent, funcName, hookId, type) {
    const patchedObject = patchedObjects.get(funcParent);
    const patch = patchedObject?.[funcName];
    if (!patch?.[type].has(hookId))
      return false;
    patch[type].delete(hookId);
    if (patchTypes.every((t) => patch[t].size === 0)) {
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: patch.o,
        writable: true,
        configurable: true
      });
      if (!success)
        funcParent[funcName] = patch.o;
      delete patchedObject[funcName];
    }
    if (Object.keys(patchedObject).length == 0)
      patchedObjects.delete(funcParent);
    return true;
  }
  function unpatchAll() {
    for (const [parentObject, patchedObject] of patchedObjects.entries())
      for (const funcName in patchedObject)
        for (const hookType of patchTypes)
          for (const hookId of patchedObject[funcName]?.[hookType].keys() ?? [])
            unpatch(parentObject, funcName, hookId, hookType);
  }

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/getPatchFunc.js
  var getPatchFunc_default = (patchType) => (funcName, funcParent, callback, oneTime = false) => {
    if (typeof funcParent[funcName] !== "function")
      throw new Error(`${funcName} is not a function in ${funcParent.constructor.name}`);
    if (!patchedObjects.has(funcParent))
      patchedObjects.set(funcParent, {});
    const parentInjections = patchedObjects.get(funcParent);
    if (!parentInjections[funcName]) {
      const origFunc = funcParent[funcName];
      parentInjections[funcName] = {
        o: origFunc,
        b: /* @__PURE__ */ new Map(),
        i: /* @__PURE__ */ new Map(),
        a: /* @__PURE__ */ new Map()
      };
      const runHook = (ctxt, args, construct) => {
        const ret = hook_default(funcName, funcParent, args, ctxt, construct);
        if (oneTime)
          unpatchThisPatch();
        return ret;
      };
      const replaceProxy = new Proxy(origFunc, {
        apply: (_2, ctxt, args) => runHook(ctxt, args, false),
        construct: (_2, args) => runHook(origFunc, args, true),
        get: (target, prop, receiver) => prop == "toString" ? origFunc.toString.bind(origFunc) : Reflect.get(target, prop, receiver)
      });
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: replaceProxy,
        configurable: true,
        writable: true
      });
      if (!success)
        funcParent[funcName] = replaceProxy;
    }
    const hookId = Symbol();
    const unpatchThisPatch = () => unpatch(funcParent, funcName, hookId, patchType);
    parentInjections[funcName][patchType].set(hookId, callback);
    return unpatchThisPatch;
  };

  // node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/index.js
  var before = getPatchFunc_default("b");
  var instead = getPatchFunc_default("i");
  var after = getPatchFunc_default("a");

  // src/patcher.ts
  var observations = /* @__PURE__ */ new Set();
  var observer = new MutationObserver((records) => {
    const changedElems = /* @__PURE__ */ new Set();
    for (const record of records)
      changedElems.add(record.target);
    for (const elem of changedElems)
      for (const [sel, cb] of observations) {
        if (elem.matches(sel))
          cb(elem);
        elem.querySelectorAll(sel).forEach((e) => (e instanceof HTMLElement || e instanceof SVGElement) && cb(e));
      }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true
  });
  var patcher_default = {
    ...esm_exports,
    observe: (sel, cb) => {
      const entry = [sel, cb];
      observations.add(entry);
      return () => observations.delete(entry);
    },
    unobserve: () => {
      observations.clear();
      observer.disconnect();
    }
  };

  // src/en_translate/EN_CONSTANTS.json
  var __0 = "KaiHeiLa english constants by Yellowsink for KaiHax";
  var __1 = "based off of their english constants, but much cleaned up and with missing keys";
  var __2 = "please credit if used";
  var click_refresh = "Click Refresh";
  var add = "Add";
  var added = "Added";
  var remove = "Remove";
  var app_name = "Kaiheila";
  var prompt = "Propmpt";
  var confirm = "Confirm";
  var ok = "OK";
  var cancel = "Cancel";
  var home_page = "My Home";
  var friend = "Friend";
  var add_friend = "Add friend";
  var remove_friend = "Remove friend";
  var remove_friend_description = "Are you sure you want to remove {{username}} from your friends list?";
  var online = "Online";
  var all = "All";
  var requested = "Requested";
  var request_to_be_friend = "Request to be friend";
  var blocked = "Blocked";
  var private_message = "Private Message";
  var not_friend = "Uh... no friends yet.";
  var not_online_friend = "You have no friends online, go and call them to play!";
  var not_pending_friend_requested = "You have no pending friend requests.";
  var not_blocked = "You haven't blocked anyone.";
  var request_send_success = "Requested successfully";
  var request_send_error = "Request failed";
  var placeholder_username = "Enter username#0000";
  var friend_request_error = "Friend request failed";
  var send_friend_request = "Send friend request";
  var require_username_identify = "You need a username and tag to add a friend";
  var check_username_identify = "Check that the username is spelled correctly";
  var emoji_manage = "Emoji Manage";
  var add_emoji = "Add emoji";
  var emoji_manage_description = "Here you can add your favorite server emoji to the emoji bar.";
  var emoji_added = "Emoji added";
  var emoji_not_added = "Emoji not added";
  var drag_modify_emoji_order = "Drag to modify the order of emoji";
  var click_preview = "Click preview";
  var preview = "Preview";
  var static_emoji = "Emoji";
  var gif_emoji = "GIF";
  var guild_not_emoji = "The guild has not uploaded any emoji";
  var emoji_all_added = "Emoji all added";
  var want_use_emoji = "Want to use emoijs in all servers?";
  var buy_vip_use_emoji = "Buy BUFF to use any emoji and unlock other perks";
  var learn_more = "Learn more";
  var add_chat_buff = "Add a chat BUFF";
  var per_month_price = "Unlock perks for as little as \xA519.9 per month";
  var buy_vip_can_unlock_permission = "BUFF can unlock many perks covering text & voice chat, and more, improving your experience";
  var buy_vip = "Activate now";
  var renewal = "Renew now";
  var gift_friend = "Gift to a friend";
  var vip_permission = "BUFF perk";
  var vip_description = "BUFF description";
  var add_buff_make_it_more_interesting = "Add BUFF to the chat to make it more fun";
  var add_buff = "Activate onw";
  var kaiheila_vip = "Activate Kaieila BUFF";
  var select_friend = "Select a friend";
  var vip_plan = "BUFF duration";
  var payment_mode = "Payment method";
  var payment_price = "Payment amount: ";
  var yuan = "\u5143";
  var bill_record = "Bill record";
  var not_found_bill = "Can't find bill? Submit a ticket";
  var date = "Date";
  var buy_goods = "Buy goods";
  var purpose = "Use";
  var bill_id = "Order no.: ";
  var payment_time = "Payment time: ";
  var use_time = "Recharge time: ";
  var gift_user = "Recipient: ";
  var bill_wrong = "Questions about this order?";
  var kindly_reminder = "Kind tip";
  var bill_tips = "1. The system will charge after successful payment, and will recharge automatically within 24 hours if the charge fails.\n2. If online banking duplicates payments, or the order is cancelled after payment, the refund will be processed in 15 working days.";
  var bill_list_none = "No billing records";
  var cdkey = "Redeem Code";
  var exchange_vip_please_input_cdkey = "Redeeming a gift? Please enter the code below: ";
  var exchange = "Redeem";
  var exchange_success = "Redeemed successfully";
  var login_codetitle = "Welcome to Kaiheila!";
  var login_switchbtn = "Switch to password login";
  var login_switchcodebtn = "Switch to Captcha Login";
  var login_mobilepla = "Please enter your cell phone number";
  var login_mobilelab = "Cell phone number";
  var login_codelab = "Cell phone verification code";
  var login_acqcodehl = "Get verification code";
  var login_fillcodepla = "Fill in the verification code";
  var login_loginbtn = "Register / Login";
  var login_nextloginlab = "Next automatic login";
  var login_thirdptbtn = "Third party account login";
  var login_docstr = "Click the Register/Login button to agree to the {%lTerms of Service} and {%lPrivacy Policy}.";
  var login_docstr_m = "I have read and agree to the {%l Kaiheila User Agreement} and {%l Privacy Policy}";
  var login_loginbtn_m = "Login";
  var login_pwlab = "Password";
  var login_pwpla = "Please enter your password";
  var login_forgetpwbtn = "Forgot your password?";
  var login_resetpwbtn = "Reset Password";
  var login_returnloginbtn = "Return to Login";
  var feedback_tipbtn = "Help";
  var channel_mutetip = "Mute";
  var channel_cmutetip = "Unmute";
  var channel_toptip = "Top";
  var channel_userlisttip = "User List";
  var search_searchtip = "Search";
  var channel_onlinelab = "Online";
  var channel_offlinelab = "Offline";
  var server_ownerlab = "Server owner";
  var boost_boosterlab = "Boosters";
  var boost_datetip = "Server Boost %s Start";
  var friend_mypagebtn = "Home";
  var server_joinserverbtn = "Join a server";
  var server_explserverbtn = "Discover Servers";
  var download_dlclentbtn = "Download apps";
  var server_markreaditem = "Mark as read";
  var server_invitem = "Invite";
  var server_notifyitem = "Notification settings";
  var server_privacyitem = "Privacy settings";
  var server_nodisturbitem = "Mute";
  var server_nodisturbtitle = "Set %s to Do Not Disturb";
  var server_muteitem_m = "Mute";
  var server_mutestr = "Muting a server will turn off all notifs except for @mentions";
  var server_notificationlab = "Notification settings";
  var sever_withoutnoticeitem = "No notifications";
  var sever_allmembersw = "Turn off @all and @here notifications";
  var sever_allrolesw = "Turn off @mention notifications for all roles";
  var server_cmuteitem = "Unmute";
  var server_duraminitem = "Last %s minutes";
  var server_durahitem = "Last %s hours";
  var server_duraforevitem = "Until I turn on again";
  var server_leaveserveritem = "Leave";
  var voice_inputmodestr = "Voice mode";
  var voice_autostr = "Voice detection";
  var voice_pushstr = "Press F2 to speak";
  var voice_mictestitem = "try out the microphone";
  var voice_copyuntip = "Copy username";
  var voice_mutebtn_m = "Mute";
  var voice_deafen_m = "Deafen";
  var user_copysucctip = "Copied";
  var user_settingtip = "User Settings";
  var voice_connectedbtn = "Voice connected";
  var voice_detstip = "Connection details";
  var voice_joinbtn_m = "Join voice";
  var voice_joinstr_m = "Its quiet in here. Are you alone? Hurry up and call your friends to Kaiheila!";
  var voice_quittip = "Leave voice";
  var voice_quitbtn_m = "Leave";
  var voice_reconnectionstr_m = "Failed to connect to voice";
  var voice_reconnectionbtn_m = "Reconnect";
  var voice_qualitytitle = "Voice quality";
  var voice_qualitystr = "Please rate your experience, we will improve to provide a better service";
  var voice_goodbtn = "Good";
  var voice_badbtn = "Bad";
  var voice_mcitem = "Host mode";
  var voice_freedomitem = "Free mode";
  var voice_allmembersbtn = "All members";
  var voice_mcgmtip = "Voice admin";
  var voice_allmemberstitle = "All channel members";
  var voice_allmemberspla = "Search channel members";
  var voice_swmodetitle = "Switch voice mode";
  var voice_swmcmodestr = "Should change channel mode to host mode";
  var voice_swfreedommodestr = "Should change channel mode to free mode";
  var voice_mcnullstr = "Uhh ~ no one is currently speaking, if you want to speak, please click the mic";
  var voice_mcqueuebtn = "Queue";
  var voice_mcexitqueuebtn = "Remove from queue";
  var voice_mcapplyingbtn = "Asking to speak...";
  var voice_mcapplybtn = "Ask to speak";
  var voice_mcconsentbtn = "Agree to speak";
  var voice_mcapplytip = "Long press to ask to speak";
  var diagnosis_connecttitle = "Connection Diagnostics";
  var diagnosis_applydttip = "Diagnostic tools";
  var diagnosis_mictestlab = "Mic Test";
  var diagnosis_mictestbtn = "Test";
  var diagnosis_stoptestbtn = "Stop Testing";
  var diagnosis_statuslab = "Network Connection Status";
  var diagnosis_mypclab = "My Computer";
  var diagnosis_serverlab = "Server";
  var diagnosis_laglab = "Latency";
  var diagnosis_losslab = "Packet Loss Rate";
  var diagnosis_switchlinebtn = "Switching Lines";
  var diagnosis_domlinestr = "You are currently using a domestic voice line, do you want to switch to an overseas accelerated line?";
  var diagnosis_intllinestr = "You are currently using an overseas accelerated line, do you want to switch to a domestic voice line?";
  var diagnosis_cxlbtn = "Cancel";
  var diagnosis_switchbtn = "Switch";
  var accompany_sourcelab = "Select the music source";
  var accompany_allbtn = "All sources";
  var accompany_nosourcestr = "There is no music source, please run a music player first and try again.";
  var tuning_talkstr = "Please speak into the microphone for detection.";
  var tuning_switchstr = "Switched to microphone %s";
  var tuning_micinputstr = "The current microphone has sound input, if no sound is heard, it will go to output device detection.";
  var tuning_soundbtn = "Sound is heard";
  var tuning_nosoundbtn = "No sound is heard";
  var tuning_testingvocstr = "Test sound playing...";
  var tuning_speakerlab = "Switched to speaker%s";
  var tuning_speakeroostitle = "Your speakers are not working";
  var tuning_reportlab = "A voice exception report has been generated for you.";
  var tuning_submithl = "Submit a support ticket";
  var tuning_retrybtn = "Try again";
  var tuning_stopbtn = "Ending the test";
  var tuning_micoostitle = "No voice input detected, your voice input device is broken";
  var tuning_reasonstr = "The device is not working also for the following reasons.";
  var tuning_winauthhl = "{%l1. Windows permissions are set incorrectly.}";
  var tuning_turnonmichl = "{%l2. The computer microphone is not enabled.}";
  var tuning_antivirushl = "{%l3. Kaiheila is disabled by security software.}";
  var tuning_micsubmithl = "If all checks are still not resolved, you can {%lsubmit a support ticket}";
  var tuning_goodtogostr = "Your voice device works fine";
  var tuning_suggeststr = "If others still can't hear your voice, suggest they do voice detection in their settings.";
  var tuning_okbtn = "Good";
  var ai_aitip = "AI noise reduction - eliminate background noise and keep only your voice.";
  var ai_aiswitchsw = "AI noise reduction";
  var ai_aidetstr = "AI Noise Reduction eliminates background noise and keeps your human voice! Try it out!";
  var ai_trybtn = "Test";
  var voice_inputlab = "Input Devices";
  var voice_outputlab = "Output Devices";
  var message_sendtopla = "Send a message to %s";
  var message_enterstr = "Press enter to send a message";
  var message_nopermissionpla = "You do not have permission to send messages in this channel";
  var emoji_stkrtip = "Emoji";
  var upload_uploadtip = "Upload";
  var printscreen_deftip = "Screenshot (not yet set) Hold Shift and click to hide the window";
  var printscreen_settip = "Screenshot (%s) Shift-click to hide the window";
  var message_unfoldtip = "Expand input field";
  var message_foldtip = "Collapse input field";
  var message_tipstr = "You can't chat here yet, you must join the server before you can start interacting";
  var upload_albumbtn = "Screenshot album";
  var upload_localbtn = "Local files";
  var message_atonlinebtn = "@ Online members(here)";
  var message_atallbtn = "@ All members(all)";
  var message_atonlinestr = "Online members";
  var message_atallstr = "All members";
  var message_atmestr = "me";
  var message_atauthonlinestr = "Mention all online members who have permission to view this channel";
  var message_atauthonlinestr_m = "Mention this channel's online members";
  var message_atauthallstr = "Mention all members who have permission to view this channel";
  var message_atauthallstr_m = "Mention this channel's members";
  var message_atauthrolestr = "Notify role members who have permission to view this channel.";
  var message_atauthrolestr_m = "Mention this channel's members with this role";
  var emoji_searchpla = "Search emojis";
  var emoji_nostkrstr = "This server has no emojis";
  var emoji_figurelab = "Characters";
  var emoji_naturelab = "Nature";
  var emoji_foodlab = "Food";
  var emoji_sportlab = "Sports";
  var emoji_travellab = "Travel";
  var emoji_objectlab = "Objects";
  var emoji_symbollab = "Symbols";
  var emoji_flaglab = "Flags";
  var message_historystr = "You are viewing old news";
  var message_latestbtn = "View the latest news";
  var message_cdstr = "Members speak at %s intervals";
  var message_remitstr = "Slow mode is on, but you are immune!";
  var message_amountstr = "There are %s1 new messages since %s";
  var message_markasreadbtn = "Mark as read";
  var message_sendbtn = "Send";
  var message_sendpla = "Click to send message, Enter key to line feed";
  var message_escstr = "Esc to cancel, Enter to save";
  var message_reacttip = "Respond";
  var message_edtip = "Edit";
  var message_replytip = "Reply";
  var message_moretip = "More";
  var message_copybtn = "Copy";
  var message_delbtn = "Delete";
  var message_copyimgbtn = "Copy image";
  var message_pastebtn = "Paste";
  var message_ededstr = "(Edited)";
  var message_fromtip = "From: %s";
  var message_otherreactbtn = "Other reactions";
  var upload_dragtitle = "Drag and drop upload";
  var upload_releasestr = "Dragging in a file? Drop to upload!";
  var upload_filenamestr = "\uFF08Click the filename to edit\uFF09";
  var _fraudhl = "Please beware of scams in chat, click to learn how to prevent scams";
  var channel_welcometitle = "Welcome to the server";
  var channel_invstr = "Invite all your friends in one click.";
  var channel_qrcodestr = "Scan the QR code to download the Kaiheila App to chat with your friends anytime, anywhere.";
  var channel_questionstr = "Have an issue? View the help pages or get in touch with us.";
  var channel_invbtn = "Invite Friends";
  var channel_downloadbtn = "Download App";
  var channel_helpcenterbtn = "Help Center";
  var server_boosteritem = "Server Help";
  var server_settingitem = "Server Settings";
  var server_settingbtn_m = "Settings";
  var server_cchanitem = "Create channel";
  var server_cgrpitem = "Create group";
  var server_changenameitem = "Modify server nickname";
  var server_hideitem = "Hide muted channels";
  var group_muteitem = "Mute";
  var group_mutetitle_m = "Mute";
  var group_closeitem = "Collapse";
  var group_createitem = "Create group";
  var group_delitem = "Delete";
  var group_edititem = "Edit group";
  var invite_invitem = "Invite";
  var channel_editem = "Edit channel";
  var channel_cloneitem = "Clone channel";
  var channel_delitem = "Delete channel";
  var channel_setpwitem = "Set password";
  var printscreen_occupytitle = "The following hotkeys are occupied";
  var printscreen_hotkeystr = "Set screenshot shortcut key (%s)";
  var printscreen_neveritem = "No longer prompted";
  var printscreen_closebtn = "Close";
  var printscreen_settingbtn = "Go to Settings";
  var invite_creatinvtip = "Create an invite";
  var invite_invtitle = "Invite a friend to join %s";
  var invite_invitedstr = "Sent";
  var invite_sharelinkstr = "Share this invite link and your friends can join by clicking it";
  var invite_copybtn = "Copy";
  var invite_copysusbtn = "Copied";
  var invite_linktimestr1 = "Your link will expire after %s%s1, or after using %s2 times.";
  var invite_linktimestr2 = "Your link will expire after %s%s1.";
  var invite_linkcontistr = "Your link will never expire.";
  var invite_linktimestr3 = "Your link will expire after using %s%s times.";
  var invite_linktimeday = "days";
  var invite_linktimemin = "minutes";
  var invite_linktimehour = "hours";
  var invite_edhl = "Edit Invite Link";
  var invite_durationlab = "Expiration time";
  var invite_selectpla = "Please select";
  var invite_timeslab = "Maximum number of uses";
  var invite_newlinkbtn = "New link";
  var invite_unlimedem = "No limit";
  var invite_neveritem = "Never";
  var invite_timesitem = "%s times";
  var invite_duraminitem = "%s minutes";
  var invite_durahitem = "%s hours";
  var invite_duradayitem = "%s days";
  var severmenu_overallitem = "Overview";
  var severmenu_boosteritem = "Server Boost Status";
  var severmenu_authitem = "Role Permissions";
  var severmenu_logitem = "Admin Log";
  var severmenu_toolsitem = "Widgets";
  var severmenu_safetyitem = "Security Settings";
  var severmenu_mbritem = "Members";
  var severmenu_blacklistitem = "Banned users";
  var severmenu_delitem = "Delete Server";
  var severoverview_gnllab = "Basic Settings";
  var severoverview_userlab = "User Management";
  var severoverview_gnltitle = "Server Overview";
  var severoverview_changebtn = "Modify";
  var severoverview_arealab = "Server Area";
  var severoverview_idlab = "Public server";
  var severoverview_idstr = "Make your server public, and other users can join the server directly through discovery.";
  var severoverview_defchanlab = "Default Text Channel";
  var severoverview_defchanstr = "All server invites will go to the default text channel";
  var severoverview_welcomechanlab = "Welcome message channel";
  var severoverview_welcomechanstr = "When someone joins, this channel will receive a random welcome message.";
  var severoverview_nodefitem = "No default channel";
  var severoverview_nowelcomeitem = "No welcome message";
  var severoverview_bannerbtn = "Banner";
  var severoverview_checkbtn = "View";
  var severoverview_cdstr = "You can change the recommended server information after 7 days";
  var severoverview_recommendedapplystr = "Find friends and join the list of recommended servers to find more members!";
  var severoverview_recommendedapplybtn = "Apply to be recommended";
  var severoverview_recommendeditem_m = "Become a recommended server";
  var severoverview_notrecommendeditem_m = "Not a recommended server";
  var severoverview_recommendstr_m = "Please see to the web page for recommended server settings.";
  var severoverview_destitle = "Modify server info";
  var severoverview_destitle_m = "Server Info";
  var severoverview_iconbtn = "Update server icon";
  var severoverview_iconitem_m = "Server Icon";
  var severoverview_coveragainbtn_m = "Re-Upload";
  var severoverview_coverstr = "PNGs are supported with suggested minimum 1024x600, suggested aspect ratio of 5:3, and max image size of 5MB.";
  var severoverview_photoitem_m = "Select image";
  var severoverview_cameraitem_m = "Camera shot";
  var severoverview_defnotilab = "Default Notification Settings";
  var severoverview_defnotistr = "This decides if users without notification settings set will be notified of every message in this server";
  var severoverview_allmesitem = "All messages";
  var severoverview_atmesitem = "Only @ is mentioned";
  var severoverview_recomserlab = "Referring Servers";
  var severoverview_recomserstr = "Become a referral server?";
  var severoverview_averonlineminlab = "Average member online time (min)";
  var severoverview_onlinemintip = "Duration (min)";
  var severoverview_swcditem = "Southwest (Chengdu)";
  var severoverview_wshitem = "East China (Shanghai)";
  var severoverview_sszitem = "South China (Shenzhen)";
  var severoverview_nbjitem = "North China (Beijing)";
  var severoverview_asiahkitem = "Asia Pacific (Hong Kong)";
  var severoverview_intldomitem = "Domestic and foreign interconnection dedicated line";
  var severoverview_jamstr = "Congestion";
  var severoverview_areaswtitle = "A reminder";
  var severoverview_areaswstr = "Switching server region will restart all voice channels. This takes about 1 second.";
  var boost_notifylab = "Server Notification";
  var boost_notifystr = "Boost to your favorite servers and unlock up to 6 ranks. Higher ranks grant all members of the server perks. Go boost your favorite servers now!";
  var boost_serbslevelstr = "Server Boost Level LV%s";
  var boost_sertimestr = "\uFF08You have boosted this server %s times\uFF09";
  var boost_bsbtn = "Boost this server";
  var boost_levelstr = "Level%s";
  var boost_bsnumberstr = "%s booster";
  var boost_serlevelstr = "Server level LV%s";
  var boost_currentstr = "Achieved";
  var boost_equitystr = "Perks include";
  var boost_needstr = "%s boosts still needed";
  var boost_stkrnumstr = "%s number of server emojis (%s total)";
  var boost_voicekbpsstr = "Audio quality: %skbps ";
  var boost_uploadlimstr = "%sMB file upload limit";
  var boost_userlimstr = "%s maximum members (total %s people)";
  var boost_bannerstastr = "Server banner (static)";
  var boost_pstkrnumstr = "+%s number of server emojis (total %s)";
  var boost_pgifstkrstr = "+%s number of server animated emojis (total %s)";
  var boost_giflogostr = "Server animated logo ";
  var boost_puserlimstr = "+%s maximum members (total %s people)";
  var boost_cusidstr = "Custom Server ID ";
  var boost_gifbannerstr = "Server banner (animated)";
  var boost_boosternumstr = "You can see booster status here, including the number of booster packs.";
  var boost_boosterchangestr = "Booster pack quantity change";
  var boost_serverlevelstr = "Current server booster level LV%s";
  var boost_expirestr = "LV%s will expire in %s.";
  var boost_gracestr = "*You will keep your level until the end of the buffer period of three days.";
  var boost_levelquitytitle = "LV%s entitlement";
  var boost_bannerstr = "Server Banner";
  var boost_serstkrnumstr = "Number of server emojis";
  var boost_sergifnumstr = "Number of server animated emojis";
  var boost_cusstr = "Custom";
  var boost_givenstr = "Given";
  var boost_gifstr = "Animated";
  var boost_ststr = "Static";
  var boost_voicequalstr = "Audio quality";
  var boost_serverlogostr = "Server logo";
  var boost_filesizestr = "File upload limit size";
  var boost_userlimnumstr = "Maximum members";
  var boost_kbpsstr = "%skbps";
  var boost_atallstr = "@AllMembers";
  var roles_orderstr = "The ranking in the member list can be changed by dragging and dropping. Users' color will be the highest role they have.";
  var roles_authhelpstr = "Need help with role permissions?";
  var roles_namelab = "Role name";
  var roles_colorlab = "Role color";
  var roles_settinglab = "Role settings";
  var roles_distgshsw = "Show members of this role separately from regular online members";
  var roles_allowallatsw = "Allow anyone to @mention this role";
  var roles_atnoticestr = 'Note: Members with the "Mention @all members, @here and all roles" permission can bypass this restriction.';
  var roles_gnlauthlab = "General permissions";
  var roles_adminsw = "Administrators";
  var roles_adminstr = "Having this permission gives you full administrative rights, including bypassing all other permissions (including channel permissions). In short, you can do everything except delete the server, which is high-risk.";
  var roles_mgrsw = "Manage server";
  var roles_mgrstr = "Members with this permission can modify server name, avatar and region, as well as unspecified profile setting items, and set server security.";
  var roles_mgrlogsw = "View administrative logs";
  var roles_mgrlogstr = "Members with this permission can view the administrative logs of the server.";
  var roles_linkstr = "Members with this permission can create invitation links.";
  var roles_invsw = "Manage invitations";
  var roles_invstr = "Members with this permission can manage server invitations.";
  var roles_chansw = "Channel Management";
  var roles_chanstr = "Members with this permission can create new channels and edit or delete existing channels (and groups).";
  var roles_remsw = "Remove members";
  var roles_remstr = "Members with this permission can remove other members.";
  var roles_blacklistsw = "Ban";
  var roles_blackliststr = "Members with this permission can ban other members and view the ban list.";
  var roles_cusstkrsw = "Manage custom emojis";
  var roles_cusstkrstr = "Members with this permission can manage custom emojis.";
  var roles_chgnamesw = "Modify nickname";
  var roles_chgnamestr = "Users with this permission can change their nicknames.";
  var roles_chgothnmsw = "Modify others' nicknames";
  var roles_chgothnmstr = "Users with this permission can change other people's nicknames.";
  var roles_authmagsw = "Manage role permissions";
  var roles_authmagstr = "Members with this permission can create new roles and edit/delete roles that are lower than that role.";
  var roles_checkchansw = "View text and voice channels";
  var roles_checkchanstr = "Members with this permission can view text and voice channels.";
  var roles_wordauthlab = "Text permission";
  var roles_wordauthsw = "Send text messages";
  var roles_wordauthstr = "Members with this permission can send messages in the text channel.";
  var roles_msgmagsw = "Message management";
  var roles_msgmagstr = "Members with this permission can delete messages sent by other members and top messages.";
  var roles_uploadsw = "Upload files";
  var roles_uploadstr = "Members with this permission can upload files (including images).";
  var roles_atallsw = "Mention @all, @here and All Roles";
  var roles_atallstr = 'Members with this permission can use @all, @here to mention all members in the channel, this permission can bypass the "Allow anyone to @mention this role" restriction.';
  var roles_reactstr = "Members with this permission can add new responses to messages.";
  var roles_vocsw = "Voice permissions";
  var roles_vocconnectsw = "Voice connection";
  var roles_vocconnectstr = "Members with this permission can connect to the voice channel.";
  var roles_vocpsvsw = "Passive connection to voice channels";
  var roles_vocpsvstr = "Members with this permission can passively invite or be moved to the voice channel when they do not have voice connection permission.";
  var roles_speaksw = "Speak";
  var roles_speakstr = "Members with this permission can speak in the voice channel.";
  var roles_acpmntsw = "Play music";
  var roles_acpmntstr = "Members with this permission can play background music in the voice channel.";
  var roles_vocmagsw = "Voice management";
  var roles_vocmagstr = "Members with this permission can modify channel speech mode, manage channel members on mic, transfer channel members to other channels and kick them out of the channel.";
  var roles_serdeafensw = "Server Deafen";
  var roles_serdeafenstr = "Members with this permission can restrict the ability of other members to listen.";
  var roles_sermutesw = "Server mute";
  var roles_sermutestr = "Members with this permission can restrict other members' ability to speak and play music.";
  var roles_vocactsw = "Use free mic";
  var roles_vocactstr = "Members without this permission must use push-to-talk to speak in the channel.";
  var roles_clearauthbtn = "Clear Role Permission";
  var roles_createitem_m = "Create role";
  var roles_createstr_m = "Use roles to organise your members and set their permissions. You can also assign perms on the members page.";
  var emoji_sktuploadstr = "Emojis %s for members to use within this server. Emoji names include only Chinese, English, numbers and at least two characters, max emoji filesize 512KB.";
  var emoji_sktuploadfftstr = "Supports uploading 50 custom emoticons";
  var emoji_sktuploadbtn = "Upload emoticons";
  var emoji_stsktstr = "Static emoji list - %s available";
  var emoji_stgifstr = "Animated emoji list - %s available";
  var emoji_sktnamelab = "Name";
  var emoji_uploaderlab = "Uploader";
  var log_logmagstr = "Records administrative actions performed within the server";
  var log_msgdelstr = "Delete message {%b%s}";
  var log_msgdetstr = "Message content: {%b%s}";
  var log_chanedstr = "Edit channel {%b%s}";
  var log_namechgstr = "Name changed from {%b%s} to {%b%s1}";
  var log_modechgstr = "Channel mode changed from {%b%s} to {%b%s1}";
  var log_linkcreatestr = "Invite Link created {%b%s}";
  var log_invcodestr = "Invitation Code: {%b%s}";
  var log_linkrecallstr = "Revoke invitation link %s";
  var log_sftyrulesedstr = "Edit security rules {%b%s}";
  var log_turnonstr = "Turn off {%b%s}";
  var log_turnoffstr = "Turn on {%b%s}";
  var log_setrolestr = "Set as %s role %s1";
  var log_cxlrolestr = "Cancel %s role %s1";
  var log_edgrpauthstr = "Edit the group override permission settings for %s";
  var log_addgrpauthstr = "Add group override permission settings for %s";
  var log_remgrpauthstr = "Remove group override permissions for %s";
  var log_edchanauthstr = "Edit the channel override permission settings for %s";
  var log_addchanauthstr = "Add %s's channel override setting";
  var log_remchanauthstr = "Remove the channel override setting for %s";
  var log_createrolestr = "Create role %s";
  var log_edrolestr = "Edit role %s";
  var log_edroleauthstr = "Edit the role's permission settings";
  var log_namechgfstr = "Change name from %s to %s";
  var log_colorchgstr = "Color changed from %s to %s ";
  var log_delrolestr = "Delete role %s ";
  var log_creategroupstr = "Create group {%b%s}";
  var log_edgroupstr = "Edit group {%b%s}";
  var log_delgroupstr = "Delete group {%b%s}";
  var log_createchanstr = "Create channel {%b%s}";
  var log_delchanstr = "Delete channel {%b%s}";
  var log_descchgtostr = "Description changed from {%b%s} to {%b%s1}";
  var log_vocqualstr = "Sound quality changed from {%b%s} to {%b%s1}";
  var log_hcchgtostr = "Number of people changed from {%b%s} to {%b%s1}";
  var log_banstr = "Banned users {%b%s}";
  var log_reasonstr = "Reason: {%b%s}";
  var log_unbanstr = "Unbanned {%b%s}";
  var log_kickstr = "Kicked user {%b%s}";
  var log_turnonpwstr = "Open {%b%s}'s channel password";
  var log_chanpwisstr = "Channel password for {%b%s}";
  var log_chgchanpwstr = "Change {%b%s}'s channel password";
  var log_turnoffchanpwstr = "Close the channel password of {%b%s}";
  var widget_sertoolstitle = "Server widget";
  var widget_sertoolssw = "Turn on the server widget";
  var widget_jsonapilab = "JSON API";
  var widget_invchanlab = "Invite Channel";
  var widget_noinvitem = "No invitation";
  var widget_themeslab = "Theme";
  var widget_darkitem = "Dark";
  var widget_brightitem = "Light";
  var widget_invlinkstr = "If a channel has been selected, the widget will generate an invitation link.";
  var widget_premadelab = "Pre-made widget";
  var widget_premadestr = "Please embed this HTML code into your website to use the Kaiheila widget.";
  var security_riskstr = "Restrict members' actions in the server by setting rules, thus reducing the risk within the server. Members can be unrestricted by being given roles. {%l for detailed instructions}";
  var security_rulelistlab = "Rules List";
  var security_addrulebtn = "Add Rules";
  var security_defrulesw = "Default Rules";
  var security_prohibitstr = "In-server %s members, within join server %s, forbid %s.";
  var security_edititem = "Edit";
  var security_delitem = "Delete";
  var security_halfhourstr = "Registered for less than 30 minutes";
  var security_nonmluserstr = "Non-continental users";
  var security_recidivismstr = "Has a record of violations";
  var security_highriskitem = "High risk";
  var security_addbtn = "Add";
  var security_edittip = "(Click on the blue area to edit)";
  var security_hourminitem = "%s hour %s within 1 minute";
  var security_minitem = "%s within minutes";
  var security_msgvocstr = "Message actions and connected voice";
  var security_msgeditstr = "Message operation";
  var security_vocconnectstr = "Connect voice";
  var security_savebtn = "Save";
  var members_sermbrtitle = "Server members";
  var members_limstr = "Current server size limit %s members";
  var members_mbrstr = "%s members";
  var members_mbrstr_m = "%s members";
  var members_batbtn = "Batch operation";
  var members_contentstr = "View content.";
  var members_userroleitem = "User Roles";
  var members_dataitem = "User data";
  var members_filterstr = "Filter roles.";
  var members_filteritem_m = "Filter";
  var members_unauthitem = "Unauthenticated users";
  var members_sortstr = "Sort by";
  var members_joinascitem = "Join server time ascending";
  var members_joindescitem = "Join server time descending";
  var members_actvascitem = "Last active time ascending";
  var members_actvdescitem = "Last active time descending";
  var members_roleitem = "Roles";
  var members_batselbtn = "Batch selection";
  var members_addrolebtn = "Add a role";
  var members_delrolebtn = "Delete Role";
  var members_addblacklistbtn = "Add to blacklist";
  var members_transferitem = "Server master transfer";
  var invite_invrecallstr = "Here all available invitation links, you can revoke any one of them.";
  var invite_invuserlab = "Invitees";
  var invite_invcodelab = "Invitation Code";
  var invite_usagecountlab = "Number of uses";
  var invite_expdtimelab = "Expiration time";
  var bans_defblacklisttitle = "Blacklist is empty";
  var bans_blacklisttitle = "%s of blacklists";
  var bans_blackliststr = "We currently use accounts to restrict users.";
  var bans_noblockusertitle = "No users have been blacklisted";
  var bans_noblockuserstr = "No one has been blacklisted, which is good. But again, not so good in a sense.";
  var bans_noblockuser2str = "Please don't be soft if you need to be.";
  var bans_reasonstr = "Reason for joining.";
  var bans_removebtn = "Move out of blacklist";
  var bans_donebtn = "Complete";
  var usermenu_acctsettingitem = "Account Setup";
  var usermenu_authitem = "Authorization Management";
  var usermenu_bufflab = "Kaiheila BUFF";
  var usermenu_actbuffitem = "Activate BUFF";
  var usermenu_mybillsitem = "My Billing";
  var usermenu_mybillsbtn_m = "Bills";
  var usermenu_codeitem = "Redemption Code";
  var usermenu_appitem = "Application Settings";
  var usermenu_vocitem = "Voice Settings";
  var usermenu_hotkeyitem = "Key Settings";
  var usermenu_sktitem = "Emoji Management";
  var usermenu_overlayitem = "In-game overlay";
  var usermenu_notifiitem = "Notifications";
  var usermenu_themesitem = "Appearance";
  var usermenu_themesitem_m = "Appearance";
  var usermenu_toolsitem = "Tools";
  var usermenu_advanceitem = "Advanced Settings";
  var usermenu_activityitem = "User Activity";
  var usermenu_windowsitem = "Windows Settings";
  var usermenu_updatelogitem = "Changelog";
  var usermenu_logoutitem = "Logout Login";
  var account_bannerlab = "Modify banner";
  var account_uploadbannerlab = "Upload banner";
  var account_bannerstr = "Support uploading PNG, GIF images, recommended size 628x250px, image size no more than 5MB.";
  var account_portraitlab = "Change avatar";
  var account_portrait_m = "Avatar";
  var account_buffendstr = "BUFF end time %s";
  var account_usernamestr = "User Name";
  var account_namechgcdstr = "90 day interval for each username change for normal users\r\nBUFF users get a 10 day interval for each username change";
  var account_phonelab = "Cell phone number";
  var account_phoneitem_m = "Modify mobile number";
  var account_phonetitle_m = "Verify mobile number";
  var account_thirdpartylab = "Third party account binding";
  var account_unlinkphonbtn = "Unlink";
  var account_linkbtn = "Link";
  var account_safetylab = "Account Security";
  var account_cxlbtn = "Delete";
  var account_bufftip = "Want a custom tag?";
  var account_bannerbtn = "Unlock Banner";
  var account_removebannerlab = "Remove Banner";
  var account_confirmtip = "Are you sure you want to remove the banner?";
  var account_removebannerbtn = "Remove";
  var sever_removebtn = "Kick";
  var account_editnametitle = "Edit Username";
  var account_nameidstr = "Username and ID";
  var account_rdmnumbtn = "Random number";
  var account_namecdstr = 'You wont be able to change your name again for %s days, are you sure you want to change to "%s1"?';
  var account_namecdstr_m = "Days until next username change: %s days";
  var account_namecdtip = "BUFF shortens the username change cooldown";
  var account_verifcodetitle = "Step 1 - Verify the original phone number";
  var account_wfmtstr = "Wrong format of verification code";
  var account_nextbtn = "Next step";
  var account_verifytitle = "Please complete the verification";
  var account_movepla = "Please press and hold the slider and drag to the far right";
  var account_loadingstr = "Loading";
  var account_authedstr = "Verification passed";
  var account_reacqsecstr = "Retrieve after %s seconds";
  var account_linknewphonetitle = "Step 2 - Bind the new phone";
  var account_linkphonelab = "Bind cell phone";
  var account_alreadyinusestr = "The cell phone number has been registered";
  var account_changepwlab = "Change the account password";
  var account_sendcodestr = "Send a verification code to the phone number %s";
  var account_verficodelab = "Verification code";
  var account_newpwlab = "New password";
  var account_pwlimitpla = "6-30 digits in English, numbers and symbols, not pure numbers";
  var account_unlinkbtn = "Unbind";
  var account_wechatconfstr = "Are you sure you want to unlink your WeChat account?";
  var account_qqconfstr = "Are you sure you want to unlink your Tencent QQ account";
  var account_wechatqrstr = "Use WeChat Swipe to login";
  var account_wechatstr = "WeChat Login";
  var account_wechatstr_m = "WeChat";
  var account_kaiheilatitle = "KAIHEILA";
  var account_cxlnoticestr = "We are sorry to hear that you want to leave Kaiheila. To ensure your account safety, before you submit a deletion request, you must also meet the following criteria.";
  var account_safetysitulab = "The account is in a safe state";
  var account_safetysitustr = "High risk accounts cannot be deleted. The account must not have been changed within seven days and there is no risk of theft.";
  var account_normsitulab = "The account is in normal use";
  var account_normsitustr = "There is no violation of the account operation. Accounts within the penalty period cannot be cancelled.";
  var account_noserlab = "The account does not own any of the servers";
  var account_noserstr = "Server owners cannot be deleted. Please make sure you no longer own any of the servers before deleting your account. You may transfer your ownership or delete your servers.";
  var account_nobotlab = "Account does not own any of the bots";
  var account_nobotstr = "It is not possible to logout when you own bots. Please delete all your bots in the development center.";
  var privacy_settingstr = "Here you can change your settings for your privacy";
  var privacy_defserlab = "Server default privacy settings";
  var privacy_sertitle = "Privacy Settings - %s";
  var privacy_sermsgsw = "Allow server members to PM you";
  var privacy_sersittingapplystr = "This setting will be applied when you join a server. It does not apply to your existing servers.";
  var privacy_addfriendlab = "Who can add you as a friend";
  var privacy_allsw = "Everyone";
  var privacy_friendfrisw = "Friends of Friends";
  var privacy_uxlab = "User Experience Improvement Program";
  var privacy_uxsw = "Participate in the UX Improvement Program";
  var privacy_uxstr = "Allow us to track your usage to help us improve our service for you.";
  var privacy_agreementstr = "Click to view the Kaiheila {%l Software License and Service Agreement} and {%l Privacy Policy}";
  var authorized_authappstr = "This shows the authorized apps, you can delete them at any time.";
  var authorized_devcenterlab = "Khehela Developer Center";
  var authorized_brieflab = "Introduction";
  var authorized_authlab = "Permissions";
  var authorized_allowinfostr = "Allow reading user information";
  var authorized_cancelbtn = "Cancel Auth";
  var authorized_obslab = "OBS in-game override";
  var authorized_remotecallstr = "Allow remote procedure calls";
  var authorized_readsermsgstr = "Read server messages";
  var invite_invstr = "This is where you keep track of the people who have been invited by you to join Kaiheila";
  var invite_myinverlab = "My Invitees";
  var invite_notfilledstr_m = "Not filled";
  var invite_invcodeinputpla = "Please enter the invitation code/invitation link, which cannot be changed after confirmation.";
  var invite_confirmbtn = "Confirmation";
  var invite_confirmbtn_m = "OK";
  var invite_myinvcodestr = "My Invitation Code: %s";
  var invite_invlinkregstr = "The number of new users who have successfully registered through your link will be tracked. Below is the total number of users you have invited. ";
  var invite_invidentilab_m = "Number of Invitees";
  var invite_invidentistr = "Invited certified users %s";
  var invite_approachlab = "How to invite users";
  var invite_enterserstr = "1. Go to any server";
  var invite_invbuttonstr = "2. Click the Invite button to generate a link";
  var invite_copylinkstr = "3. Copy the link and send it to your friend";
  var buff_endsstr = "You're enjoying the BUFF perks\r\n%s expire";
  var buff_renewbtn = "Renew now";
  var buff_giftbtn = "Give to a friend";
  var buff_equitystr = "Unlock more benefits for as little as $19.90 per month!";
  var buff_effecttitle = "BUFF perk";
  var buff_settitle = "BUFF package";
  var buff_bannerlab = "Background Banner";
  var buff_bannerstr = "Customized background image, support GIF format";
  var buff_gifportraitlab = "Animated user avatar";
  var buff_gifportraitlab_m = "Animated avatar";
  var buff_gifportraitstr = "Interesting animated avatar, make your profile less boring";
  var buff_crosssersktlab = "Cross-server emojis";
  var buff_crosssersktstr = "Get rid of server restrictions and use more emojis.";
  var buff_higeruploadlimitlab = "Higher upload limit";
  var buff_higeruploadlimitlab_m = "Upload 100MB files";
  var buff_higeruploadlimitstr = "Support uploading up to 100MB files, now you can share more joy!";
  var buff_intlvoclab = "Overseas voice acceleration";
  var buff_intlvocstr = "No setup needed, automatically accelerate overseas voice connection!";
  var buff_cusnumlab = "Customized user tag";
  var buff_cusnumstr = "You may be the next #0001.";
  var buff_uniquelab = "Unique badge";
  var buff_uniquestr = "Exclusive BUFF badge to show your support";
  var buff_morehl = "{%lLearn more}BUFF perks";
  var buff_bufftitle = "BUFF Description";
  var buff_timelab = "BUFF time calculation";
  var buff_timestr = "A single month BUFF is valid for 30 days from the BUFF opening date.";
  var buff_renewlab = "BUFF Renewal";
  var buff_renewstr = "If you renew the BUFF within the BUFF validity period, the BUFF validity period will be accumulated from your current BUFF expiration time backward, accumulating to your BUFF validity period by 30 days/month.";
  var buff_paylab = "Payment Methods";
  var buff_paymentstr = "BUFF payment methods are currently only available: WeChat payment and Alipay. Don't make private chat transactions, the official staff will not take the initiative to ask for money.";
  var buff_giftlab = "BUFF Gift";
  var buff_giftstr = "The gifted user needs to be friends with the gifting user. The BUFF is effective for the gifted user immediately after the gift is successfully given.";
  var buff_buffstr = "Add BUFF to the chat to make it more interesting.";
  var buff_buyitnowbtn = "Activate Now";
  var buff_actbufftitle = "Activate the Kaiheila BUFF";
  var buff_bufftimelab = "BUFF Duration";
  var buff_discountstr = "%s Discount";
  var buff_annualstr = "Yearly";
  var buff_semiannualstr = "Semi-Annual";
  var buff_seasonalstr = "Quarterly";
  var buff_monthlystr = "Monthly";
  var buff_paymentlab = "Payment method.";
  var buff_alipaybtn = "Alipay";
  var buff_amountstr = "Payment amount.";
  var buff_rmbstr = "Yuan";
  var buff_aggrementhl = "{%l Kaiheila BUFF Member Service Agreement}";
  var buff_selectfriendlab = "Select a friend";
  var buff_activated_m = "activated";
  var buff_nonactivated_m = "nonactivated";
  var buff_bufftitle_m = "BUFF subscriber";
  var boost_boosttitle = "Launch server boost";
  var boost_booststr = "Each booster pack is valid for 30 days and can unlock up to 6 server levels. As the server level increases, all members of the server can enjoy more rights and benefits. Go boost your favorite server! ";
  var boost_unusedlab = "Unused booster packs";
  var boost_usenowbtn = "Use Now";
  var boost_purchasebtn = "Purchase";
  var boost_serequitytitle = "Server booster benefits";
  var boost_serbooststr = "Boost a server to receive.";
  var boost_uniqueidentitystr = "A unique identification in the member list.";
  var boost_badgestr = "A shiny badge in your profile panel.";
  var boost_uniquerolestr = "Exclusive role in the booster server.";
  var boost_boosterserstr = "Boosted servers get:";
  var boost_moresersktstr = "More server emojis can be uploaded.";
  var boost_highervocqualitystr = "Better voice channel call quality.";
  var boost_highersizelimstr = "Increased upload limit for the entire server.";
  var boost_serequitystr = "{More} server benefits.";
  var boost_pricestr = "The server booster package is only \uFFE520/each, and you can enjoy 30% discount for opening BUFF, and you can launch a booster for the server you have joined. ";
  var boost_numbooststr = "%s booster";
  var boost_buyboosttitle = "Purchase server booster package";
  var boost_durationstr = "Boost Pack is valid for 30 days after recharge";
  var boost_discountstr = "BUFF%s discount";
  var boost_aggrementstr = "{%l Kaiheila Booster Pack Service Agreement}";
  var boost_serboosttitle = "Booster Server";
  var boost_selectnumstr = "Choose the number of booster packs";
  var boost_neednumstr = "Need %s1 booster pack before LV%s";
  var boost_usebtn = "Use";
  var boost_succtitle = "Server booster success";
  var boost_succstr = "You have successfully boosted %s server %s1 times.";
  var boost_currenttitle = "Servers currently being boosted";
  var boost_startatstr = "Boost start time: %s";
  var boost_usedstr = "Boosts used %s";
  var billing_reportbtn = "{%l Can't find a bill? Submit a support ticket}";
  var billing_datelab = "Date";
  var billing_productlab = "Product purchased";
  var billing_purposelab = "Use";
  var billing_monthbuffstr = "Kaiheila BUFF Single Month";
  var billing_daybuffstr = "One Day";
  var billing_triduumbuffstr = "Three days of the Kaiheila BUFF";
  var billing_monthbooststr = "Server Boost Pack (30 days)";
  var billing_wechatpaystr = "WeChat payment";
  var billing_selfusestr = "Self-use";
  var billing_amountstr = "Payment amount\uFF1A%s";
  var billing_billnumstr = "Order number\uFF1A%s";
  var billing_methodstr = "Payment method\uFF1A%s";
  var billing_datestr = "Payment time\uFF1A%s";
  var billing_questionhl = "{%l have questions about the order?}";
  var billing_tipslab = "Kind Tips";
  var billing_tipsstr = "1. The system will automatically recharge after successful payment, and will automatically recharge within 24 hours if the recharge fails.\n2. If the Internet banking duplicate payment or the order is cancelled after payment and the recharge is not successful, the Internet banking refund will arrive within 15 working days.";
  var cdk_giftcardstr = "Want to redeem a gift? Please enter the code below:.";
  var cdk_giftcardpla = "AAAAAAAA-BBBBB-CCCC-DDDDD-EEEEEEEEEEEEEEEE";
  var cdk_nullcdkstr = "Code cannot be empty.";
  var cdk_shortcdkstr = "Code should contain at least 18 characters.";
  var cdk_longcdkstr = "Code can only contain up to 36 characters.";
  var cdk_wrongcdkstr = "C_NOT_FOUND";
  var cdk_collectbtn = "Redemption";
  var cdk_succtitle = "Redemption successful";
  var cdk_succstr = 'Congratulations you get: "%s "*%s1';
  var voice_autosyssw = "Automatic selection of system recommended settings";
  var voice_autosysstr = "When this setting is turned on, the device change prompt will no longer pop up when the computer device is changed.";
  var voice_micvoclab = "Microphone input volume";
  var voice_strstr = "Enhancement.";
  var voice_dbstr = "+%sdB";
  var voice_vocoutputlab = "Voice output volume";
  var voice_aidescstr = "Allows you to erase the background sound from the microphone and keep only the speaking voice.";
  var voice_inputlab_m = "input";
  var voice_keyitem_m = "Push To Talk";
  var voice_speakeritem_m = "Speaker mode";
  var voice_keylab_m = "Set talk keybind";
  var voice_keybtn_m = "Set shortcut keys";
  var voice_keyupliftlab_m = "'Key talk' releases key delay";
  var voice_autodetnsw = "Automatic voice recognition sensing sensitivity";
  var voice_exceedstr = "Voices above this threshold will be automatically recognized and transmitted";
  var voice_micswitchlab = "Microphone on/off shortcut key";
  var voice_nohotkeypla = "Not yet set";
  var voice_resetbtn = "Reset";
  var voice_deafenlab = "Mute on/off shortcut";
  var voice_vocimprovetitle = "Voice Improvement";
  var voice_echosw = "Echo Cancellation";
  var voice_noisesw = "Noise Cancellation";
  var voice_aistr = "Noise cancellation is not available when microphone AI noise reduction is on.";
  var voice_micenhancesw = "Microphone Sound Amplification";
  var keybinds_hotkeystr = "Here you can change the shortcut key setting of Kaiheila.";
  var keybinds_texttitle = "Text Chat";
  var keybinds_textlab = "Send Message";
  var keybinds_enteritem = "Enter";
  var keybinds_ctrlenteritem = "Ctrl + Enter";
  var keybinds_voctitle = "Voice Chat";
  var keybinds_vochotkeylab = "Set keystroke talk shortcuts";
  var keybinds_screenshottitle = "Screenshot";
  var keybinds_scrsstr = "Set screenshot shortcut keys";
  var keybinds_mouseustr = "(mouse settings are not supported at this time)";
  var keybinds_fsscrsstr = "Set full screen screenshot shortcut";
  var emoji_stklovestr = "Here you can add your favorite server emoji to the emoji bar.";
  var emoji_edittitle_m = "Edit emoji";
  var emoji_stkaddedbtn = "Added emojis";
  var emoji_stknotaddedbtn = "No emojis added";
  var emoji_dragorderstr = "Drag and drop to modify the order of emojis";
  var emoji_addsktbtn = "Add emojis";
  var overlay_descpstr = "Here you can overview the in-game overlay settings";
  var overlay_explstr = "To let you enjoy the thrill of the game without the distraction of recognizing your friends' voices. We will display the user who is talking in the top left corner of your screen while you are playing.";
  var overlay_localab = "Overlay position";
  var overlay_clicklocastr = "Click to change the overlay position";
  var overlay_portraitsizelab = "Avatar size";
  var overlay_defsizestr = "Default Style";
  var overlay_maxstr = "Max";
  var overlay_displaylab = "Display Settings";
  var overlay_alwaysitem = "Always";
  var overlay_onlyspeakitem = "Only when speaking";
  var overlay_faqlab = "In-game override FAQ";
  var overlay_faqstr = 'Q: Why does my in-game override not work?\nA\u2236 If the in-game overlay does not work, the following may solve the problem.\n1. Close the client, right-click the startup icon and select "Run as administrator";\n2. Check the settings and make sure the "In-game overlay" is enabled in the "Voice Attachment" item;\n3. Check the game display settings and change the "full screen" of the game to "borderless window".';
  var notificatios_desktopsw = "Turn on desktop notifications";
  var notificatios_desktopstr = "Desktop alert pops up in the notification center when you receive a mention (@) message, and you can turn it off with a switch. ";
  var notificatios_inboxsw = "Taskbar blinking";
  var notificatios_inboxstr = "Blink the avatar in the taskbar when there is a new notification.";
  var notificatios_phonenotilab = "Phone notification settings when logging in on desktop side";
  var notificatios_alwaysitem = "Phone always receives notifications";
  var notificatios_fiveminitem = "Phone receives notifications after 5 minutes of not operating the computer";
  var notificatios_tenminitem = "Receive notifications after 10 minutes of inactivity";
  var notificatios_fifteenitem = "Receive notifications after 15 minutes of inactivity";
  var notificatios_neveritem = "Cell phone does not receive notifications";
  var notificatios_tonesw = "Alert tone";
  var notificatios_volumesw = "Alert volume";
  var notificatios_notificationsw = "Message notification";
  var notificatios_deafensw = "Mute headset";
  var notificatios_undeafensw = "Unmute headset";
  var notificatios_mutesw = "Microphone mute";
  var notificatios_unmutesw = "Microphone unmute";
  var notificatios_disconnectedsw = "Voice connection disconnected";
  var notificatios_pttactsw = "'Key Talk' on";
  var notificatios_pttdeacsw = "'Push to talk' off";
  var notificatios_joinsw = "User connected";
  var notificatios_leavesw = "User leaves";
  var notificatios_printscreensw = "Full screen shot";
  var appearance_appearancesw = "Theme mode";
  var appearance_darkitem = "Dark mode";
  var appearance_lightitem = "Light mode";
  var appearance_autosw = "Auto switch theme mode";
  var appearance_lightlab = "Light mode on";
  var appearance_darklab = "Dark mode on";
  var appearance_autosw_m = "Automatic (follow system settings)";
  var tool_desstr = "Here you can find the tools provided by Kaiheila, and you can set them";
  var tool_printscreentitle = "Screenshot tool";
  var tool_savectlglab = "Screenshot save directory";
  var tool_chgbtn = "Change";
  var tool_openctlgbtn = "Open directory";
  var tool_livetitle = "Live Streaming Tools";
  var tool_livestr = 'If you have any other questions or suggestions, please go to the "#OBS Feedback and Suggestions" channel in the {%l Kaihiela Center} to give feedback to the staff.';
  var tool_obsstr = "OBS official website";
  var tool_connectbtn = "Connect Now";
  var obs_stateitem = "Status Panel";
  var obs_textitem = "Text Panel";
  var obs_voiceitem = "Voice Panel";
  var obs_onlinenumsw = "Show number of people online";
  var obs_severiconsw = "Show server icons";
  var obs_invitesw = "Show server invitations";
  var obs_methodlab = "Invitation method";
  var obs_linkitem = "Invite Link";
  var obs_appearancelab = "Appearance style";
  var obs_darkitem = "Dark mode";
  var obs_fullbtn = "Click on the full screen to see the effect";
  var obs_urlstr = "After completing the panel configuration, enter the following URL in the browser source, width and height:.";
  var obs_sizestr = "Width: %spx, Height: %spx";
  var obs_textchannellab = "Text Channel";
  var obs_fontlab = "Font size";
  var obs_fontsizelab = "%spx";
  var obs_voicechannel = "Voice channel";
  var obs_headitem = "Avatar mode";
  var obs_ptgitem = "Stand-up mode";
  var obs_speakshowsw = "Show only when speaking";
  var obs_nicknamesw = "Show nickname";
  var obs_headsw = "Show avatar";
  var obs_combinationlab = "Combination mode";
  var obs_leftitem = "Avatar on the left";
  var obs_toplitem = "Avatar on top";
  var obs_poslab = "Position setting";
  var obs_sortlab = "Sort by";
  var obs_vrtitem = "Vertical sorting";
  var obs_horitem = "Horizontal sorting";
  var obs_cusizepositem = "Custom position";
  var obs_spacelab = "Display spacing";
  var obs_stylelab = "Style setting";
  var obs_nicknamefontsizelab = "Nickname font size";
  var obs_nicknamefontlab = "Nickname font";
  var obs_defitem = "System default";
  var obs_fontstr = "The font package needs to be loaded in advance, so please wait for a while if the font style is not displayed.";
  var obs_otherlab = "Other styles";
  var obs_bubblesw = "Add speech bubble";
  var obs_shadowsw = "Add speech shadow";
  var obs_lightsw = "Add speech glow";
  var obs_colourlab = "Glow colors";
  var obs_resetbtn = "Reset colors";
  var advanced_devsw = "Developer Mode";
  var advanced_devcopyiditem = "Copy ID";
  var advanced_devstr = "Developers can write and manage bots in this mode in a more portable way.";
  var advanced_undetectablestr = "No games detected";
  var status_playstr = "What are you playing right now?!";
  var status_unseenstr = "Don't see your game?";
  var status_addbtn = "Add one!";
  var status_gamesw = "Show game dynamics in personal status";
  var status_musicsw = "Show music dynamics in personal status";
  var status_selectgamepla = "Select a game";
  var status_addgamebtn = "Add a game";
  var status_backbtn = "Back";
  var status_playingstr = "In the middle of a game";
  var windows_autostartsw = "Start up automatically";
  var windows_autostartstr = "When this option is turned on, Kaiheila is automatically started when the game is turned on";
  var windows_minimizesw = "Automatically minimizes on startup";
  var windows_minimizestr = "If this option is enabled, we will hide to tray after boot up. We will come back out when you need it.";
  var windows_traysw = "Minimize to tray when closing";
  var windows_traystr = "When this option is turned on, the program will be minimized to the tray when you click the close button in the upper right corner.";
  var windows_dxvasw = "Hardware acceleration";
  var windows_dxvastr = "Turning on hardware acceleration will make Kaiheila run more smoothly. Please turn off this feature if the game is experiencing frame drops. (Translator's note: this breaks KH on Linux)";
  var update_updatestr = "Record our growth steps, also record everyone's expectations for us";
  var update_versionstr = "(Current version logo: %s)";
  var quit_quitstr = "Are you sure you want to log out?";
  var textoverview_channelnamelab = "Channel name";
  var textoverview_channeldeslab = "Channel description";
  var textoverview_channelnamepla = "Input channel name";
  var textoverview_channeldespla = "Input channel description";
  var textoverview_lowlab = "Slow mode";
  var textoverview_close = "Off";
  var textoverview_lowstr = "Unless members have channel management or message management privileges, the frequency they send messages, needs to be greater than the interval time.";
  var textoverview_savestr = "You change... But if you insist...";
  var textoverview_giveupbtn = "Abandon the change";
  var textoverview_savebtn = "Save changes";
  var roles_rolepla = "Search for roles and members";
  var roles_categstr = "Synced with {%b%s} grouping permissions";
  var roles_categchangestr = "The current channel role permissions have changed and are no longer synchronized with {%b%s} permissions.";
  var roles_categstrbtn = "Keep grouping synchronized";
  var channeldel_deltitle = 'Delete "%s';
  var channeldel_delstr = "Are you sure you want to delete %s? All the contents that already exist will disappear, and the operation cannot be undone!";
  var voiceoverview_qualitylab = "Sound quality";
  var voiceoverview_fluencylab = "Smooth";
  var voiceoverview_normallab = "Normal";
  var voiceoverview_highlab = "High quality";
  var voiceoverview_maxlab = "Maximum number of people on the channel";
  var voiceoverview_unlimitlab = "No limit";
  var password_opensw = "Channel Password";
  var password_formatpla = "Please input password, password only support 1~12 digits";
  var password_inputtitle = "Input channel password";
  var password_inputpla = "Please input the password";
  var password_passworderror = "Channel password error";
  var copy_channelnametitle = "The channel password is incorrect in %s";
  var copy_copystr = "The newly created channel and %s are exactly the same in terms of permission setting, bit rate and capacity.";
  var copy_nullerror = "Channel name cannot be empty";
  var createserver_createtitle = "Oh, another server?";
  var createserver_createservertitle1 = "Create";
  var createserver_createstr = "Create a new server and invite your friends to join, it's free!";
  var createserver_createbtn = "Create a server";
  var createserver_createbtn_m = "Create";
  var createserver_jointitle1 = "Join";
  var createserver_joinstr1 = "Enter an instant invite and join your buddy's server.";
  var createserver_joinbtn = "Join a server";
  var createserver_tpltitle = "Choose a server template";
  var createserver_tplstr = "A server is like a room where you can chat and play with your friends, so create a server and invite your friends to join!";
  var createserver_freedombtn = "I want to create a server freely";
  var createserver_selectlab = "Choose a template";
  var createserver_frienditem = "Play with friends";
  var createserver_guilditem = "I have a guild";
  var createserver_communityitem = "Develop a community";
  var createserver_fansitem = "Gather fans";
  var createserver_study = "Build a learning world";
  var createserver_tplchannellab = "Template Channel";
  var createserver_tplrolelab = "Template Role";
  var createserver_tplpreviewlab_m = "Template preview";
  var createserver_gmrolestr = "The administrator has all the rights to manage the channel and can do everything except delete the server.";
  var createserver_textgmstr = "Text channel administrator can manage messages in the text channel.";
  var createserver_voicegmstr = "Voice channel administrator can manage voice members.";
  var createserver_textchannelgmstr = "Text channel administrator";
  var createserver_voicechannelgmstr = "Voice channel administrator";
  var createserver_selectbtn = "Select";
  var createserver_createservertitle2 = "Create your server";
  var createserver_createserverstr = "Create a topic server of interest and you can chat with your friends by voice/text for free";
  var createserver_updatelogobtn = "Update LOGO";
  var createserver_uploadlogobtn = "Upload server logo";
  var createserver_uploadlogobtn_m = "Go to settings";
  var createserver_iconsizestr1 = "Minimum icon size is 128\xD7128";
  var createserver_iconsizestr2 = "We recommend 512\xD7512 (max filesize 5M)";
  var createserver_servernamelab = "Server name";
  var createserver_servernamepla = "Enter a server name";
  var joinserver_jointitle2 = "Enter an instant invitation or server ID below to join an existing server. The invitation link and server ID will look something like this.";
  var joinserver_jointitle2_m = "The invitation link and server ID will look something like this.";
  var joinserver_inputlab_m = "Enter Invitation";
  var joinserver_completelink = "https://kaihei.co/HfGqxS";
  var joinserver_completestr = "(full)";
  var joinserver_simplifylink = "kaihei.co/HfGqxS";
  var joinserver_simplifystr = "(simplified)";
  var joinserver_minimallink = "HfGqxS";
  var joinserver_minimalstr = "(very simplified)";
  var joinserver_idlink = 42543621;
  var joinserver_idstr = "(Public server ID)";
  var joinserver_idinputpla = "Enter instant invite link or server ID";
  var joinserver_Invalidcodeerror = "Invalid server invitation code!";
  var sever_leavetitle = 'Leave "%s"';
  var sever_leavestr = "Are you sure you want to leave %s? You wont be able to read any messages unless you are re-invited";
  var server_muteitem = "Do Not Disturb";
  var folder_readitem = "Mark folder as read";
  var folder_settingitem = "Folder settings";
  var folder_namelab = "Folder Name";
  var folder_namepla = "Enter the server folder name";
  var folder_colourlab = "Folder color";
  var folder_cuscolourtip = "Change color";
  var user_profileitem = "Personal Information";
  var user_mentionitem = "@Mention";
  var user_invitevoiceitem = "Invite to voice";
  var user_noteitem = "Add a note";
  var user_privatemessageitem = "Private Message";
  var user_uservolumeitem = "User Volume";
  var user_inviteserveritem = "Invite to server";
  var user_addfrienditem = "Add a friend";
  var user_sentfrienditem = "Friend request sent";
  var user_kickitem = "Remove from this server";
  var user_banitem = "Remove and add to blacklist";
  var user_kickvoiceitem = "Disconnect voice";
  var user_movetoitem = "Move to";
  var user_blockuseritem = "Block this user";
  var profile_block = "Block";
  var profile_introlab = "Profile";
  var profile_notepla = "Click to add a note";
  var profile_norolelab = "No role";
  var profile_viewprofilebtn = "View Profile";
  var profile_listeninglab = "Listening to music";
  var profile_playinglab = "Playing games";
  var profile_playingtimestr = "Already played %s%s1";
  var profile_intropla = "Click to add a profile";
  var profile_changenicknameotherstr = "You are editing someone's nickname.";
  var profile_nicknamelab = "Nickname";
  var profile_resetnicknamebtn = "Reset nickname";
  var profile_submitbtn = "Submit";
  var search_advancedsearchbtn = "Advanced Search";
  var search_messageitem = "News";
  var search_fileitem = "Documents";
  var search_picturevideoitem = "Image/Video";
  var search_resultstr = "%s of results";
  var search_skipbtn = "Jump";
  var search_searchingstr1 = "Searching";
  var search_searchingstr2 = "Searching";
  var search_emptystr1 = "No results";
  var search_emptystr2 = "No relevant search results found";
  var search_allchannelitem = "All Channels";
  var search_generalitem = "General";
  var search_useritem = "User";
  var search_channelitem = "Channels";
  var search_servermessageitem = "Server news";
  var search_rangelab = "Scope.";
  var search_categorystr = "Toggle category";
  var search_movestr = "Move cursor";
  var search_selectitemstr = "Select entry";
  var search_escstr = "Close window";
  var search_searchpla = "Please enter search content";
  var search_keywordstr = "Enter keywords to search %s";
  var search_selectrangetitle = "Select range";
  var search_selectserverlab = "Select server";
  var search_channelrangelab = "Channel range";
  var __3 = "Translator's note: JAVASCRIPT STRIKES AGAIN!!!!!";
  var undefined2 = "All channels";
  var search_designatedchannelitem = "Specify the channel";
  var search_messagetypelab = "Message Type";
  var search_texttypeitem = "Text";
  var search_picturevideotypeitem = "Image and video";
  var search_allprivatemessageitem = "All private messages";
  var search_designatedprivatemessageitem = "Specify private message";
  var feedback_friendstr = "Friends, Private Messages";
  var feedback_servermenustr = "Server menu";
  var feedback_channelliststr = "Channel list";
  var feedback_serverliststr = "Server list";
  var feedback_discoverstr = "Discovery Page";
  var feedback_desstr = "If you encounter problems while using Kaiheila, you can choose one of the ways to solve them.";
  var feedback_faqlab = "FAQ";
  var feedback_helpbtn = "View help document";
  var feedback_mfaqitem_m = "Mobile FAQ";
  var feedback_helpstr_m = "View Kaiheila support pages online";
  var feedback_feedbackstr_m = "Create your support ticket, we will reply as soon as possible";
  var feedback_otherlab = "Other feedback channels.";
  var feedback_feedbacktitle = "Feedback and Suggestions";
  var feedback_typelab = "What's Happening";
  var feedback_troubleitem = "I have a problem";
  var feedback_adviseitem = "I have a suggestion";
  var feedback_platformlab = "Choose a platform";
  var feedback_questiontypelab = "Type of problem";
  var feedback_deslab = "Describe the content";
  var feedback_troubledespla = "Please put the details of the problem here, enter at least five characters";
  var feedback_advisepla = "Please write a detailed description of the suggestion here, enter at least five characters";
  var feedback_deviceinfolab = "Get device information";
  var feedback_loglab = "Upload logs";
  var feedback_pcitem = "PC";
  var feedback_webitem = "Web";
  var feedback_androiditem = "Android";
  var feedback_iositem = "iOS";
  var feedback_h5item = "H5";
  var feedback_tyoeitem = "Please select the question type";
  var feedback_voiceitem = "Voice Question";
  var feedback_textitem = "Text Chat Questions";
  var feedback_accountitem = "Account Questions";
  var feedback_serveritem = "Server Management Questions";
  var feedback_billitem = "Billing Questions";
  var feedback_other = "Other Questions";
  var feedback_despla = "Please fill in the description";
  var feedback_deserror = "Please enter at least five characters for the description";
  var message_topnumstr = "Topped messages(%s)";
  var message_topdefaultstr = "This channel does not have any top messages yet";
  var message_allreadbtn = "All read";
  var message_nomorestr = "No more";
  var messagebox_newmessagenumstr = "New messages (%s)";
  var messagebox_overlookallbtn = "Ignore all";
  var messagebox_mentionstr = "@me";
  var messagebox_friendrequestitem = "Friend request";
  var friends_hotkeyckstr = "Ctrl+K";
  var friends_frienditem = "Friend";
  var friends_allitem = "All";
  var friends_requestitem = "Request";
  var friends_blockeditem = "Blocked";
  var friends_requeststr = "Request to become a friend";
  var friends_noawaitingstr = "There are no pending friend requests here.";
  var friends_emptyflstr = "Uh... There are no friends yet.";
  var friends_emptyblstr = "There is no one in the blocked list.";
  var friends_noonlinestr = "You have no friends online at this time, so go get them to play!";
  var friends_deltitle = "Remove friend %s";
  var friends_delitem = "Remove friend";
  var friends_confirmstr = "Are you sure you want to remove %s from your friends list?";
  var friends_addfriendstr = "Add friend";
  var friends_tempmsgstr = "Temporary Sessions";
  var friends_msgtopstr = "Here is the beginning of your private message history with %s.";
  var friends_friendstr = "You have become friends with %s";
  var friends_invsentstr = "You sent an invitation (%s), but ......";
  var friends_invrecstr = "You received an invitation (%s), but ......";
  var friends_invexpiredtitle = "The invitation has expired";
  var friends_fourofourstr = "Although accidents don't happen often, they always do.";
  var friends_serinvsentstr = "You sent an invitation to join a server (%s)";
  var friends_serinvacceptstr = "You have been invited to join a server (%s)";
  var friends_onlinestr = "%s online";
  var friends_joinedstr = "Joined";
  var friends_reportitem = "Report";
  var friends_reasontitle = "Please select the reason for reporting";
  var friends_personalinfostr = "Will not disclose your personal information";
  var friends_pornlab = "Pornography";
  var friends_advertislab = "Spam";
  var friends_harassmentlab = "Unkind/abusive";
  var friends_dislikelab = "Content is offensive to me";
  var friends_otherpla = "Other reasons";
  var discover_interestpla = "Enter the game you are interested in";
  var discover_officialsertitle = "Official Partner Server";
  var discover_topbtn = "Top";
  var discover_checkbtn = "View Servers";
  var discover_promotebtn = "Join Recommended Servers";
  var discover_promotestr = "Let more people find your server";
  var discover_loadingtitle = "Loading, please wait...";
  var featured_recomsertitle = "Apply to become a referral server";
  var featured_criteriastr = "Application requirements.";
  var featured_memberstr = "1. Server members";
  var featured_membernumstr = "\u226550 users";
  var featured_avgonlinestr = "2. Average daily online time of members for 3 consecutive days";
  var featured_timestr = ">60 minutes";
  var featured_aggrementstr = "3. Please read and comply with the {%l Community Guidelines}";
  var featured_notestr = "Note: If the server members <50 or the average online time for five consecutive days <30 minutes, the recommendation will be cancelled.";
  var featured_nonserarrivedstr = "No eligible servers";
  var featured_fulfillstr = "Meet the standard %s days";
  var featured_applyinfostr = "Fill out the application information";
  var featured_serclasslab = "Please select the server category:";
  var featured_serclasstip = "This classification option will not affect the server display";
  var featured_serbannerstr = "Click to upload the server cover image";
  var featured_serbannerlab = "Upload server cover image";
  var featured_minsizestr = "Minimum size: 1024\xD7600";
  var featured_serdescstr = "Click to add server description, control between 10-40 characters.";
  var featured_sertaglab = "Select server tag";
  var featured_serdesclab = "Add server description";
  var featured_selsertaglab = "Select server tag";
  var featured_backbtn = "Back";
  var featured_applybtn = "Apply";
  var featured_descpla = "Please enter a profile";
  var featured_guildnametip = "Please write the name of the guild team, the main game you play, and the purpose of the server's role (recruitment requirements).";
  var featured_nosuittagstr = "No suitable tag found?";
  var featured_newtaghl = "Apply for a new tag";
  var featured_tagapplytitle = "Game tag application";
  var featured_inputnametagstr = "Please enter the game name and classification, staff will review it within one working day";
  var featured_namestr = "Game name";
  var featured_nullnamestr = "The game name cannot be empty.";
  var featured_gamenamepla = "Please enter the game name";
  var featured_gameclasslab = "Game classification";
  var featured_gameclasspla = "Please select game category";
  var featured_submitsuccstr = "Submit successfully";
  var featured_inonebusstr = "Staff will review within one working day";
  var featured_guilditem = "Guild / Team";
  var featured_fanclubitem = "Fan Group";
  var featured_cmtyitem = "Community";
  var featured_officalitem = "Official Vendors";
  var featured_submittedstr = "Application has been submitted";
  var featured_onebusawaitstr = "Please wait patiently for manual review, it will take about 1 working day";
  var download_iosstr = "iOS Client";
  var download_dlnowbtn = "Download Now";
  var download_androidstr = "Android Client";
  var download_qriosstr = "Scan the code to download the iOS client";
  var download_qrandroidstr = "Scan code to download Android client";
  var tab_homelab_m = "Home";
  var tab_profilelab_m = "Profile";
  var server_boosterbtn_m = "Booster";
  var sever_modifynickname_m = "Modify server nickname";
  var sever_allowprivatesw_m = "Allow private messages";
  var invite_friendlistlab_m = "Friends list";
  var invite_sharelinklab_m = "Share link";
  var invite_copylinkbtn_m = "Copy link";
  var invite_qqstr_m = "QQ";
  var invite_qqzonestr_m = "QQ space";
  var invite_wxstr_m = "WeChat Friends";
  var invite_circlestr_m = "Friend circle";
  var friends_newstr_m = "View new friend add requests";
  var friends_blockstr_m = "View blocked users or unblock them";
  var friends_nullblockstr_m = "There is no one in the blocked list";
  var friends_nullpendingstr_m = "There are no pending requests";
  var friends_searchpla_m = "Search for friends and private messages";
  var friends_addlab_m = "Add friends by username and number";
  var friends_addtipstr_m = "Correct format: %s";
  var friends_sendbtn_m = "Send a friend request";
  var message_photobtn_m = "Albums";
  var message_previewbtn_m = "Preview";
  var message_originallab_m = "Original image";
  var message_searchpla_m = "Search for a user or role";
  var message_latelylab_m = "Recently spoken";
  var message_selectmentiontitle_m = "Select the person mentioned";
  var user_aboutkhlitem_m = "About Us";
  var channel_sort_m = "Sorting";
  var voice_balllab_m = "Hoverball settings";
  var voice_ballstr_m = "See who is speaking while using other apps and also perform quick actions";
  var voice_ballsw_m = "Turn on the hoverball";
  var voice_ballpermissionitem_m = "Hoverball permission";
  var voice_deniedstr_m = "Not enabled";
  var voice_allowstr_m = "Enabled";
  var voice_allowfloatingwindowitem_m = "Allow hover window to be displayed";
  var voice_accessrecord_m = "Use log access permission";
  var voice_balldenied_m = "Unenabled permission will cause the hoverball to not work properly.";
  var voice_disabletouchscreensw_m = "Put your face on the screen";
  var privacy_personaltitle_m = "Personal Rights Management";
  var privacy_photolab_m = "Photo";
  var privacy_photostr_m = "Set avatar, send pictures and videos in the channel, etc.";
  var privacy_cameralab_m = "Camera";
  var privacy_camerastr_m = "Functions such as sending pictures or videos after shooting";
  var privacy_microphonelab_m = "Microphone";
  var privacy_microphonestr_m = "Perform functions such as voice.";
  var privacy_locationlab_m = "Location";
  var privacy_locationstr_m = "Automatic setting of server area and other functions.";
  var privacy_systemtitle_m = "System permission management";
  var privacy_systemstr_m = "Only authorized system privileges can be queried";
  var privacy_gosystembtn_m = "Go to system settings";
  var privacy_thirdpartiesitem_m = "Third party information data sharing";
  var privacy_directorytitle_m = "Kaiheila Third Party Cooperation Directory";
  var user_aboutuseragreementitem_m = "User Agreement";
  var user_aboutprivacyagreementitem_m = "Privacy Policy";
  var user_checkitem_m = "Check for updates";
  var voice_wyyrestarttitle = "Netflix needs restarting";
  var voice_wyyrestarstr = "When you pick Netflix cloud music as the music source, Kaiheila needs to restart it";
  var voice_wyyrestarbtn = "Restart";
  var update_updatetitle = "Kaiheila ver %s is ready";
  var update_updatetip = "Click to view version %s notes";
  var update_updatebtn = "Restart";
  var voice_canthearstr = "No sound?";
  var voice_clickdebugbtn = "Test mic";
  var voice_nodevicetitle = "Couldn't find your mic";
  var voice_nodevicestr = "Unable to find your mic {%lclick here for help}.";
  var privacy_agreementupdate1title = "User agreement and privacy agreement updates";
  var privacy_agreementupdate2title = "User agreement updates";
  var privacy_agreementupdate3title = "Privacy agreement updates";
  var privacy_agreementupdate1str = 'Thank you for trusting and using Kaihiela! We have updated the {%l "Kaihiela Voice Software License Agreement"} and {%l "Kaihiela Privacy Policy"} according to the latest laws, regulations and policies, please read them carefully. If you agree, please click "Agree" to use our products and services, and we will do our best to protect your personal information according to the law.';
  var privacy_agreementupdate2str = 'Thank you for trusting and using Kaihiela! We have updated the {%l "Kaihiela Voice Software License Agreement"} according to the latest laws, regulations and policies, please read it carefully. If you agree, please click "Agree" to use our products and services, and we will do our best to protect your personal information according to the law.';
  var privacy_agreementupdate3str = 'Thank you for trusting and using Kaihiela! We have updated the {%l "Kaihiela Privacy Policy"} according to the latest laws, regulations and policies, please read it carefully. If you agree, please click "Agree" to use our products and services, and we will do our best to protect your personal information according to the law.';
  var privacy_agreementupdateokbtn = "Agree";
  var privacy_agreementupdatenobtn = "Temporarily reject";
  var kmd_blodtip = "Bold";
  var kmd_italictip = "Italic";
  var kmd_strikethroughtip = "Strikethrough";
  var kmd_underlinetip = "Underline";
  var kmd_linktip = "Link";
  var kmd_quotetip = "Quote";
  var kmd_spoilertip = "Spoiler";
  var kmd_inlinecodetip = "Inline code";
  var kmd_codeblocktip = "Code block";
  var kmd_richtexttip = "Rich text";
  var channel_syncpermissiontitle = "Sync permissions?";
  var channel_syncpermissionstr = "You moved the channel, did you adjust the %s permissions to be in sync with %s1?";
  var channel_syncpermissionstr_m = "Are the permissions of %s adjusted to be in sync with %s1?";
  var channel_syncpermissionbtn = "Permission sync";
  var channel_createtexttitle = "Create text channel";
  var channel_createvoicetitle = "Create voice channel";
  var channel_createtypelab = "Channel type";
  var message_downloadstr = "Download";
  var message_uploadsusstr = "Upload successful";
  var voice_mutestr = "You have been server muted, please contact an admin.";
  var voice_deafenstr = "You have been server deafened, please contact an admin.";
  var invite_joinedpsstr = 'Added "%s"';
  var sever_ruledelstr = "Are you sure you want to delete %s?";
  var voice_unmutedstr = "Unmuted";
  var voice_undeafenstr = "Undeafened";
  var voice_pushtotalkstr = "Push to talk";
  var voice_noserverstr = "You are not in this server yet";
  var voice_noseatavailablestr = "\u5F53\u524D\u53D1\u8A00\u533A\u5E2D\u4F4D\u5DF2\u6EE1\uFF0C\u65E0\u6CD5\u901A\u8FC7";
  var voice_noauthtospeakstr = "You do not have permission to speak in this channel, please contact an admin.";
  var voice_noauthtoconnecstr = "You do not have permission to connect to this channel";
  var voice_noauthtochangestr = "You do not have permission to change the channel mode";
  var voice_noaccessmicstr = "No microphone access";
  var voice_mutedstr = "Muted";
  var voice_movedstr = "Moved";
  var voice_modeselectedstr = "Selected mode";
  var voice_invservermutedstr = "This user is banned, please unban them before inviting them";
  var voice_hmdisconnectedstr = "Success";
  var voice_headphonemodestr = "Headphone mode";
  var voice_failtojoinstr = "Failed to join";
  var voice_disconnectedstr = "Disconnected";
  var voice_deafenedstr = "Deafened";
  var voice_commentedstr = "Commented";
  var voice_chatinvstr = "Invited to speak %s";
  var voice_chatinvrecievestr = "%s invited to you speak, do you accept?";
  var voice_chanpushtotalkswitchstr = "This channel reqiures push to talk, your mode has been switched";
  var voice_chanpushtotalkstr = "This channel requires push to talk, you must switch to it to talk";
  var voice_channelmodechangedstr = 'The channel has been changed to "%s"';
  var voice_btscounsupportedstr = "Your Bluetooth device does not support SCO, so voice calls are impossible";
  var user_updatesuccessstr = "Edited successfully";
  var user_failacquireinfostr = "Couldn't fetch user info, please refresh the page";
  var user_accountcanceledstr = "User logged out";
  var user_accessauthinfofailedstr = "Failed to get auth information";
  var upload_uploadfailstr = "Upload failed";
  var upload_takephotobtn = "Take photo";
  var upload_sizelimitstr = "Max file size %sMB";
  var upload_selectimgstr = "Select a photo";
  var upload_resourcesstr = "Resource error";
  var upload_reselectedstr = "Send failed, please retry";
  var upload_readerrorstr = "File read error, please retry";
  var upload_photoalbumbtn = "Photo album";
  var upload_oversizestr = "File exceeds %sMB, please try another";
  var upload_oversizedstr = "File size over %s";
  var __4 = "Translator's note: I have no clue what this means or should say, here's DeepL's best guess.";
  var upload_numimgoversizedstr = "There%s a picture with an original image over%s1M";
  var upload_noawaitingdlstr = "No downloads";
  var upload_noauthuploadstr = "You do not have permission to upload files";
  var upload_noaccesscamstr = "No camera access";
  var upload_noaccessalbumstr = "No photo access";
  var upload_filesavepsstr = "The file has been saved to %s";
  var upload_failedstr = "Upload failed";
  var upload_dlsuccessstr = "%s downloaded";
  var upload_dlfailedstr = "%s failed to download";
  var upload_checkalbumstr = "Image not found, check local album";
  var update_updatenowbtn = "Update now";
  var update_acceptbtn = "Accept";
  var update_rejectbtn = "Reject";
  var update_newversionstr = "Try the new version";
  var update_latestversionstr = "The latest version";
  var update_downloadfailedstr = "Download failed, please check network, storage permissions, or update manually";
  var share_sharetitle = "Share";
  var sever_uperlimit32str = "Max 32 chars";
  var sever_unblockuserstr = "Unban user";
  var sever_unblockuserconfirmstr = "Are you sure you want to unban %s";
  var sever_turnoffidstr = "After turning off custom server ID, it will become available. Disable?";
  var sever_transferstr = "Are you sure you want to tranfer %s? You will lose the server owner rights.";
  var sever_transfernoticstr = "%s is the new server owner.";
  var sever_succtokickstr = "Kicked";
  var sever_succtoblockstr = "Banned";
  var sever_serverinfofailstr = "Server info load failed, please try again";
  var sever_safemodeonstr = "Server has security on %s";
  var sever_ruleslimitstr = "Max roles reached";
  var sever_rulesavedstr = "Current role is edited and unsaved";
  var sever_removeuserauthstr = "Remove role permissions";
  var sever_removememauthstr = "Remove member permissions";
  var sever_removeauthconfirmstr = "Are you sure you want to remove the %s perm?";
  var sever_remainsamestr = "Keep current";
  var sever_quittedstr = "Left the server";
  var sever_oldversionstr = "Currently only the latest version supports changing server info";
  var sever_nullrulenamestr = "Rule name cannot be empty";
  var sever_namelowerlimitstr = "Server names must have at least 2 chars";
  var sever_lowerlimit6str = "Min 6 chars";
  var sever_inputservernamestr = "Please enter server name";
  var sever_illegalnamestr = "Name input error";
  var sever_illegalformstr = "Does not meet required format";
  var sever_idoutdatedstr = "ID expiration prompt";
  var sever_idoccupiedstr = "ID taken, pick another";
  var sever_failedtokickstr = "Failed to kick";
  var sever_failedtoblockstr = "Failed to ban";
  var sever_denynoauthstr = "Operation failed, not authorised";
  var sever_deletedstr = "Server deleted";
  var sever_asdeleteconfirmstr = "Are you sure you want to delete %s?";
  var server_verifiedstr = "Not verified";
  var server_turnoffpvmsgbtn = "Close PM";
  var server_transfersuccessstr = "Transfer success";
  var server_transferconfirmstr = "Confirm transfer";
  var server_transferbtn = "Transfer";
  var server_rightslidestr = "Swipe right to join a server";
  var server_quitconfirmstr = 'Are you sure you want to leave "%s"?';
  var server_nowordchannelstr = "No text channels";
  var server_namecdstr = "Can be changed after %s days";
  var channel_confirmtransferasurestr = "Are you sure you want to delete %s? It cannot be undone!";
  var profile_wordlimit500str = "Profile should be max 500 words";
  var privacy_leakagestr = "No leakage of your personal info";
  var pay_successstr = "Payment success";
  var pay_noproductinfostr = "Unable to get product info, purchase failed";
  var pay_failstr = "Payment failed";
  var pay_canceledstr = "Payment cancelled";
  var message_unabletoeditbtn = "The current version does not support editing this message";
  var message_stickymsgcanceledstr = "Remove pin";
  var message_slowmodeenablestr = "Slow mode on";
  var message_sendingstr = "Sending";
  var message_savetoalbumbtn = "Save to album";
  var message_resentbtn = "Resent";
  var message_reactionbtn = "Responses";
  var message_quotemsgbtn = "Quote";
  var message_nullmsgstr = "Messages must have content!";
  var message_nostinkymsgstr = "No pinned messages";
  var message_nostickymsgstr = "No pinned messages";
  var message_msgremovalstr = "This message will be permanently deleted";
  var message_linkremovalpmstr = "The link will be permanently deleted";
  var message_linkdeletedstr = "Link deleted";
  var message_linkdeleteconfirmstr = "Are you sure you want to remove the link?";
  var message_failtoloadvoicestr = "Audio load fail";
  var message_delstinkymsgstr = "Remove pin";
  var message_delstinkymsgconfirmstr = "Are you sure you want to remove this pin?";
  var message_avoidchannelatmsgstr = "Users who are not in the channel cannot be @'d";
  var message_atmsgbtn = "Mention";
  var logingiveupbtn = "Abandon login";
  var login_verifiedstr = "Verification success!";
  var login_recoverybtn = "Recover account";
  var login_phrasestr = "Please rearrange the idiom";
  var login_phonenumchangedstr = "Phone number has been changed";
  var login_logoutbtn = "Logout";
  var login_loginstr = "Login";
  var login_confirmstr = "Confirm";
  var login_clientnotinstallstr = "Client not installed";
  var login_cancelcdstr = "This account is in a cancellation cooldown period. Logging in will restore the account. Continue?";
  var login_authcodesentstr = "Verification code sent";
  var login_agreementcbstr = "Please read the agreement";
  var invite_voicechaninvstr = "Voice channel invitation";
  var invite_sharesusstr = "Share success";
  var invite_sentstr = "Invitation sent successfully";
  var invite_nullinvlinkstr = "Invite link cant be empty";
  var invite_noinvlinkstr = "No invite link";
  var invite_noaccessstr = "You don't have permission to join this channel";
  var invite_invsentstr = "Invite sent";
  var invite_invrecieveoutdatedstr = "You received an invitation, but...";
  var invite_invoutdatedstr = "Invitation expired";
  var invite_copysusstr = "Invite link copied";
  var invite_copiedstr = "Copied";
  var group_nullnamestr = "Group name cannot be empty";
  var group_groupbtn = "Group";
  var general_updatesuccstr = "Update successful";
  var general_tempunsuppotedstr = "Image not supported currently";
  var general_sentstr = "Sent";
  var general_savedstr = "Saved";
  var general_retrystr = "Retry";
  var general_quitconfirmstr = "Confirm quit";
  var general_plzinputstr = "Please enter content";
  var general_nullinfostr = "Content may not be empty";
  var general_noticestr = "Tips";
  var general_interneterrorstr = "Network error";
  var general_interneterrormsgstr = "Network broken, check it please";
  var general_failtodeletestr = "Failed to delete";
  var general_failedtosavestr = "Failed to save";
  var general_failedtogetfilestr = "Failed to get file";
  var general_failedtoapplystr = "Failed, please try again";
  var general_deletedsuccstr = "Deleted successfully";
  var general_dataerrorstr = "Data error!";
  var general_currenttimestr = "Current time, not changable";
  var general_cantdealappstr = "Cannot process the request";
  var general_appsentstr = "Request sent";
  var general_addsuccstr = "Added successfully";
  var friends_unblockbtn = "Unblock";
  var friends_reportsusstr = "Reported";
  var friends_reported24hoursstr = "Reported, the admin will process it within 24 hours!";
  var friends_nopvmsgstr = "No PM messages";
  var friends_msgrejectstr = "You wont be able to receive PMs sent by this user";
  var friends_keeprecordstr = "Your chat history will not be deleted";
  var friends_deniedstr = "Request denied";
  var friends_deletestr = "Are you sure to unfriend this user?";
  var friends_deletedstr = "Unfriended";
  var friends_deleteconfirmstr = "Confirm unfriending";
  var friends_blockconfirmstr = "Are you sure to block this user?";
  var friends_blockndeletestr = "Blocking this user will remove them from your friends list";
  var friends_acceptedstr = "Request accepted";
  var friend_strmsgdisabledstr = "The recipient does not allow PMs from strangers";
  var friend_privatmsgstr = "Members cannot be mentioned in a PM";
  var friend_privatchannelstr = "Text channels cannot be mentioned in a PM";
  var friend_blocksusstr = "Blocked";
  var friend_blockremovesusstr = "Unblocked";
  var feedback_sheetsubmitedstr = "Support ticket submitted, thanks for your feedback";
  var feedback_savesheetstr = "Support ticket content won't be saved";
  var feedback_inputprobserverstr = "Please select the server where the issue occurred";
  var feedback_failsubmitsheetstr = "Failed to submit support ticket";
  var explorer_outsidelinkstr = "You are leaving Kaiheila, please be careful for your account safety";
  var explorer_leavestr = "You are leaving Kaiheila";
  var emoji_noserverstickerstr = "No server emojis uploaded";
  var emoji_noavailablegifstr = "Animated emojis arent available right now";
  var emoji_noaddedstickerstr = "No emojis added yet";
  var emoji_namelimitstr = "The emoji name must be at least 2 chars";
  var emoji_allstickeraddedstr = "All emojis are added";
  var channel_turnoffchanpwstr = "Confirm to disable channel password";
  var channel_switchchanmodestr = "Switch channel mode";
  var channel_nullstr = "Channel is empty";
  var channel_clearchanpwstr = "The current password will be cleared after disabling";
  var account_wrongpwstr = "Wrong password!";
  var account_unlowerlimitstr = "Username must be at least 2 chars";
  var account_unlink3rdaccstr = "Click OK to unlink 3rd party account";
  var account_pwupdatedstr = "Password updated";
  var account_portraitoversiedstr = "Avatar must not be larger than %sMB";
  var account_phoneusedstr = "The phone has been tied to %s";
  var account_nullpwstr = "Password may not be empty";
  var account_nameupperlimit2str = "Nickname should contain at least 2 chars";
  var account_cancelconfirmstr = "Confirm cancellation";
  var account_canagreementstr = "Please read and agree to the instructions";
  var account_buffstr = "You are still in the BUFF period and have unused booster packs. BUFF will be cancelled and you will lose your booster packs. Are you sure?";
  var account_buffremovalstr = "You are still in the BUFF period. BUFF will be cancelled. Are you sure?";
  var account_boosterstr = "You have unused booster packs. You will lose your booster packs. Are you sure?";
  var country_cnitem = "China";
  var country_usitem = "America";
  var country_jpitem = "Japan";
  var __5 = "Translator's note: dont want to offend anyone by implying not part of china (they arent)";
  var country_hkitem = "Hong Kong, China";
  var country_moitem = "Macau, China";
  var country_twitem = "Taiwan, China";
  var country_myitem = "Malaysia";
  var country_auitem = "Australia";
  var country_caitem = "Canada";
  var country_gbitem = "Great Britain";
  var country_sgitem = "Singapore";
  var country_deitem = "Germany";
  var country_ruitem = "Russia";
  var country_egitem = "Egypt";
  var country_zaitem = "\u5357\u975E";
  var country_gritem = "\u5E0C\u814A";
  var country_nlitem = "\u8377\u5170";
  var country_beitem = "\u6BD4\u5229\u65F6";
  var country_fritem = "\u6CD5\u56FD";
  var country_esitem = "\u897F\u73ED\u7259";
  var country_huitem = "\u5308\u7259\u5229";
  var country_ititem = "\u610F\u5927\u5229";
  var country_roitem = "\u7F57\u9A6C\u5C3C\u4E9A";
  var country_chitem = "\u745E\u58EB";
  var country_atitem = "\u5965\u5730\u5229";
  var country_dkitem = "\u4E39\u9EA6";
  var country_seitem = "\u745E\u5178";
  var country_noitem = "\u632A\u5A01";
  var country_plitem = "\u6CE2\u5170";
  var country_peitem = "\u79D8\u9C81";
  var country_mxitem = "\u58A8\u897F\u54E5";
  var country_cuitem = "\u53E4\u5DF4";
  var country_aritem = "\u963F\u6839\u5EF7";
  var country_britem = "\u5DF4\u897F";
  var country_clitem = "\u667A\u5229";
  var country_coitem = "\u54E5\u4F26\u6BD4\u4E9A";
  var country_veitem = "\u59D4\u5185\u745E\u62C9";
  var country_iditem = "\u5370\u5EA6\u5C3C\u897F\u4E9A";
  var country_phitem = "\u83F2\u5F8B\u5BBE";
  var country_nzitem = "\u65B0\u897F\u5170";
  var country_thitem = "\u6CF0\u56FD";
  var country_kzitem = "\u54C8\u8428\u514B\u65AF\u5766";
  var country_kritem = "\u97E9\u56FD";
  var country_vnitem = "\u8D8A\u5357";
  var country_tritem = "\u571F\u8033\u5176";
  var country_initem = "\u5370\u5EA6";
  var country_pkitem = "\u5DF4\u57FA\u65AF\u5766";
  var country_afitem = "\u963F\u5BCC\u6C57";
  var country_lkitem = "\u65AF\u91CC\u5170\u5361";
  var country_mmitem = "\u7F05\u7538";
  var country_iritem = "\u4F0A\u6717";
  var country_maitem = "\u6469\u6D1B\u54E5";
  var country_dzitem = "\u963F\u5C14\u53CA\u5229\u4E9A";
  var country_tnitem = "\u7A81\u5C3C\u65AF";
  var country_lyitem = "\u5229\u6BD4\u4E9A";
  var country_gmitem = "\u5188\u6BD4\u4E9A";
  var country_snitem = "\u585E\u5185\u52A0\u5C14";
  var country_mlitem = "\u9A6C\u91CC";
  var country_gnitem = "\u51E0\u5185\u4E9A";
  var country_clvitem = "\u79D1\u7279\u8FEA\u74E6";
  var country_bfitem = "\u5E03\u57FA\u7EB3\u6CD5\u7D22";
  var country_neitem = "\u5C3C\u65E5\u5C14";
  var country_tgitem = "\u591A\u54E5";
  var country_bjitem = "\u8D1D\u5B81";
  var country_muitem = "\u6BDB\u91CC\u6C42\u65AF";
  var country_lritem = "\u5229\u6BD4\u91CC\u4E9A";
  var country_slitem = "\u585E\u62C9\u5229\u6602";
  var country_ghitem = "\u52A0\u7EB3";
  var country_ngitem = "\u5C3C\u65E5\u5229\u4E9A";
  var country_tditem = "\u4E4D\u5F97";
  var country_cfitem = "\u4E2D\u975E\u5171\u548C\u56FD";
  var country_cmitem = "\u5580\u9EA6\u9686";
  var country_stitem = "\u5723\u591A\u7F8E\u548C\u666E\u6797\u897F\u6BD4";
  var country_gaitem = "\u52A0\u84EC";
  var country_cgitem = "\u521A\u679C\u6C11\u4E3B\u5171\u548C\u56FD";
  var country_aoitem = "\u5B89\u54E5\u62C9";
  var country_ascensionitem = "\u963F\u68EE\u677E\u5C9B";
  var country_scitem = "\u585E\u820C\u5C14";
  var country_sditem = "\u82CF\u4E39";
  var country_etitem = "\u57C3\u585E\u4FC4\u6BD4\u4E9A";
  var country_soitem = "\u7D22\u9A6C\u91CC";
  var country_djitem = "\u5409\u5E03\u63D0";
  var country_keitem = "\u80AF\u5C3C\u4E9A";
  var country_tzitem = "\u5766\u6851\u5C3C\u4E9A";
  var country_ugitem = "\u4E4C\u5E72\u8FBE";
  var country_biitem = "\u5E03\u9686\u8FEA";
  var country_mzitem = "\u83AB\u6851\u6BD4\u514B";
  var country_zmitem = "\u8D5E\u6BD4\u4E9A";
  var country_mgitem = "\u9A6C\u8FBE\u52A0\u65AF\u52A0";
  var country_zwitem = "\u6D25\u5DF4\u5E03\u97E6";
  var country_naitem = "\u7EB3\u7C73\u6BD4\u4E9A";
  var country_mwitem = "\u9A6C\u62C9\u7EF4";
  var country_lsitem = "\u83B1\u7D22\u6258";
  var country_bwitem = "\u535A\u8328\u74E6\u7EB3";
  var country_szitem = "\u65AF\u5A01\u58EB\u5170";
  var country_giitem = "\u76F4\u5E03\u7F57\u9640";
  var country_ptitem = "\u8461\u8404\u7259";
  var country_luitem = "\u5362\u68EE\u5821";
  var country_ieitem = "\u7231\u5C14\u5170";
  var country_isitem = "\u51B0\u5C9B";
  var country_alitem = "\u963F\u5C14\u5DF4\u5C3C\u4E9A";
  var country_mtitem = "\u9A6C\u8033\u4ED6";
  var country_cyitem = "\u585E\u6D66\u8DEF\u65AF";
  var country_fiitem = "\u82AC\u5170";
  var country_bgitem = "\u4FDD\u52A0\u5229\u4E9A";
  var country_ltitem = "\u7ACB\u9676\u5B9B";
  var country_lvitem = "\u62C9\u8131\u7EF4\u4E9A";
  var country_eeitem = "\u7231\u6C99\u5C3C\u4E9A";
  var country_mditem = "\u6469\u5C14\u591A\u74E6";
  var country_amitem = "\u4E9A\u7F8E\u5C3C\u4E9A";
  var country_byitem = "\u767D\u4FC4\u7F57\u65AF";
  var country_aditem = "\u5B89\u9053\u5C14\u5171\u548C\u56FD";
  var country_mcitem = "\u6469\u7EB3\u54E5";
  var country_smitem = "\u5723\u9A6C\u529B\u8BFA";
  var country_uaitem = "\u4E4C\u514B\u5170";
  var country_siitem = "\u65AF\u6D1B\u6587\u5C3C\u4E9A";
  var country_csitem = "\u6377\u514B";
  var country_skitem = "\u65AF\u6D1B\u4F10\u514B";
  var country_liitem = "\u5217\u652F\u6566\u58EB\u767B";
  var country_bzitem = "\u4F2F\u5229\u5179";
  var country_gtitem = "\u74DC\u5730\u9A6C\u62C9";
  var country_svitem = "\u8428\u5C14\u74E6\u591A";
  var country_hnitem = "\u6D2A\u90FD\u62C9\u65AF";
  var country_niitem = "\u5C3C\u52A0\u62C9\u74DC";
  var country_critem = "\u54E5\u65AF\u8FBE\u9ECE\u52A0";
  var country_paitem = "\u5DF4\u62FF\u9A6C";
  var country_htitem = "\u6D77\u5730";
  var country_boitem = "\u73BB\u5229\u7EF4\u4E9A";
  var country_gyitem = "\u572D\u4E9A\u90A3";
  var country_ecitem = "\u5384\u74DC\u591A\u5C14";
  var country_gfitem = "\u6CD5\u5C5E\u572D\u4E9A\u90A3";
  var country_pyitem = "\u5DF4\u62C9\u572D";
  var country_mqitem = "\u9A6C\u63D0\u5C3C\u514B";
  var country_sritem = "\u82CF\u91CC\u5357";
  var country_uyitem = "\u4E4C\u62C9\u572D";
  var country_bnitem = "\u6587\u83B1";
  var country_pgitem = "\u5DF4\u5E03\u4E9A\u65B0\u51E0\u5185\u4E9A";
  var country_toitem = "\u6C64\u52A0";
  var country_sbitem = "\u6240\u7F57\u95E8\u7FA4\u5C9B";
  var country_fjitem = "\u6590\u6D4E";
  var country_ckitem = "\u5E93\u514B\u7FA4\u5C9B";
  var country_pomitem = "\u6CD5\u5C5E\u6CE2\u5229\u5C3C\u897F\u4E9A";
  var country_khitem = "\u67EC\u57D4\u5BE8";
  var country_laitem = "\u8001\u631D";
  var country_bditem = "\u5B5F\u52A0\u62C9\u56FD";
  var country_mvitem = "\u9A6C\u5C14\u4EE3\u592B";
  var country_lbitem = "\u9ECE\u5DF4\u5AE9";
  var country_joitem = "\u7EA6\u65E6";
  var country_syitem = "\u53D9\u5229\u4E9A";
  var country_iqitem = "\u4F0A\u62C9\u514B";
  var country_kwitem = "\u79D1\u5A01\u7279";
  var country_saitem = "\u6C99\u7279\u963F\u62C9\u4F2F";
  var country_yeitem = "\u4E5F\u95E8";
  var country_omitem = "\u963F\u66FC";
  var country_aeitem = "\u963F\u62C9\u4F2F\u8054\u5408\u914B\u957F\u56FD";
  var country_ilitem = "\u4EE5\u8272\u5217";
  var country_bhitem = "\u5DF4\u6797";
  var country_qaitem = "\u5361\u5854\u5C14";
  var country_mnitem = "\u8499\u53E4";
  var country_npitem = "\u5C3C\u6CCA\u5C14";
  var country_tjitem = "\u5854\u5409\u514B\u65AF\u5766";
  var country_tmitem = "\u571F\u5E93\u66FC\u65AF\u5766";
  var country_azitem = "\u963F\u585E\u62DC\u7586";
  var country_geitem = "\u683C\u9C81\u5409\u4E9A";
  var country_kgitem = "\u5409\u5C14\u5409\u65AF\u65AF\u5766";
  var country_uzitem = "\u4E4C\u5179\u522B\u514B\u65AF\u5766";
  var country_bsitem = "\u5DF4\u54C8\u9A6C";
  var country_bbitem = "\u5DF4\u5DF4\u591A\u65AF";
  var country_aiitem = "\u5B89\u572D\u62C9\u5C9B";
  var country_agitem = "\u5B89\u63D0\u74DC\u548C\u5DF4\u5E03\u8FBE";
  var country_caymanitem = "\u5F00\u66FC\u7FA4\u5C9B";
  var country_bmitem = "\u767E\u6155\u5927\u7FA4\u5C9B";
  var country_gditem = "\u683C\u6797\u7EB3\u8FBE";
  var country_msitem = "\u8499\u7279\u585E\u62C9\u7279\u5C9B";
  var country_guitem = "\u5173\u5C9B";
  var country_lcitem = "\u5723\u9732\u897F\u4E9A";
  var country_pritem = "\u6CE2\u591A\u9ECE\u5404";
  var country_doitem = "\u591A\u660E\u5C3C\u52A0\u5171\u548C\u56FD";
  var country_ttitem = "\u7279\u7ACB\u5C3C\u8FBE\u548C\u591A\u5DF4\u54E5";
  var country_jmitem = "\u7259\u4E70\u52A0";
  var country_serbiaitem = "\u585E\u5C14\u7EF4\u4E9A\u5171\u548C\u56FD";
  var country_mauritaniaitem = "\u6BDB\u91CC\u5854\u5C3C\u4E9A";
  var cancel_link = "Cancel link";
  var remove_style = "Remove style";
  var EN_CONSTANTS_default = {
    "//0": __0,
    "//1": __1,
    "//2": __2,
    click_refresh,
    add,
    added,
    remove,
    app_name,
    prompt,
    confirm,
    ok,
    cancel,
    home_page,
    friend,
    add_friend,
    remove_friend,
    remove_friend_description,
    online,
    all,
    requested,
    request_to_be_friend,
    blocked,
    private_message,
    not_friend,
    not_online_friend,
    not_pending_friend_requested,
    not_blocked,
    request_send_success,
    request_send_error,
    placeholder_username,
    friend_request_error,
    send_friend_request,
    require_username_identify,
    check_username_identify,
    emoji_manage,
    add_emoji,
    emoji_manage_description,
    emoji_added,
    emoji_not_added,
    drag_modify_emoji_order,
    click_preview,
    preview,
    static_emoji,
    gif_emoji,
    guild_not_emoji,
    emoji_all_added,
    want_use_emoji,
    buy_vip_use_emoji,
    learn_more,
    add_chat_buff,
    per_month_price,
    buy_vip_can_unlock_permission,
    buy_vip,
    renewal,
    gift_friend,
    vip_permission,
    vip_description,
    add_buff_make_it_more_interesting,
    add_buff,
    kaiheila_vip,
    select_friend,
    vip_plan,
    payment_mode,
    payment_price,
    yuan,
    bill_record,
    not_found_bill,
    date,
    buy_goods,
    purpose,
    bill_id,
    payment_time,
    use_time,
    gift_user,
    bill_wrong,
    kindly_reminder,
    bill_tips,
    bill_list_none,
    cdkey,
    exchange_vip_please_input_cdkey,
    exchange,
    exchange_success,
    login_codetitle,
    login_switchbtn,
    login_switchcodebtn,
    login_mobilepla,
    login_mobilelab,
    login_codelab,
    login_acqcodehl,
    login_fillcodepla,
    login_loginbtn,
    login_nextloginlab,
    login_thirdptbtn,
    login_docstr,
    login_docstr_m,
    login_loginbtn_m,
    login_pwlab,
    login_pwpla,
    login_forgetpwbtn,
    login_resetpwbtn,
    login_returnloginbtn,
    feedback_tipbtn,
    channel_mutetip,
    channel_cmutetip,
    channel_toptip,
    channel_userlisttip,
    search_searchtip,
    channel_onlinelab,
    channel_offlinelab,
    server_ownerlab,
    boost_boosterlab,
    boost_datetip,
    friend_mypagebtn,
    server_joinserverbtn,
    server_explserverbtn,
    download_dlclentbtn,
    server_markreaditem,
    server_invitem,
    server_notifyitem,
    server_privacyitem,
    server_nodisturbitem,
    server_nodisturbtitle,
    server_muteitem_m,
    server_mutestr,
    server_notificationlab,
    sever_withoutnoticeitem,
    sever_allmembersw,
    sever_allrolesw,
    server_cmuteitem,
    server_duraminitem,
    server_durahitem,
    server_duraforevitem,
    server_leaveserveritem,
    voice_inputmodestr,
    voice_autostr,
    voice_pushstr,
    voice_mictestitem,
    voice_copyuntip,
    voice_mutebtn_m,
    voice_deafen_m,
    user_copysucctip,
    user_settingtip,
    voice_connectedbtn,
    voice_detstip,
    voice_joinbtn_m,
    voice_joinstr_m,
    voice_quittip,
    voice_quitbtn_m,
    voice_reconnectionstr_m,
    voice_reconnectionbtn_m,
    voice_qualitytitle,
    voice_qualitystr,
    voice_goodbtn,
    voice_badbtn,
    voice_mcitem,
    voice_freedomitem,
    voice_allmembersbtn,
    voice_mcgmtip,
    voice_allmemberstitle,
    voice_allmemberspla,
    voice_swmodetitle,
    voice_swmcmodestr,
    voice_swfreedommodestr,
    voice_mcnullstr,
    voice_mcqueuebtn,
    voice_mcexitqueuebtn,
    voice_mcapplyingbtn,
    voice_mcapplybtn,
    voice_mcconsentbtn,
    voice_mcapplytip,
    diagnosis_connecttitle,
    diagnosis_applydttip,
    diagnosis_mictestlab,
    diagnosis_mictestbtn,
    diagnosis_stoptestbtn,
    diagnosis_statuslab,
    diagnosis_mypclab,
    diagnosis_serverlab,
    diagnosis_laglab,
    diagnosis_losslab,
    diagnosis_switchlinebtn,
    diagnosis_domlinestr,
    diagnosis_intllinestr,
    diagnosis_cxlbtn,
    diagnosis_switchbtn,
    accompany_sourcelab,
    accompany_allbtn,
    accompany_nosourcestr,
    tuning_talkstr,
    tuning_switchstr,
    tuning_micinputstr,
    tuning_soundbtn,
    tuning_nosoundbtn,
    tuning_testingvocstr,
    tuning_speakerlab,
    tuning_speakeroostitle,
    tuning_reportlab,
    tuning_submithl,
    tuning_retrybtn,
    tuning_stopbtn,
    tuning_micoostitle,
    tuning_reasonstr,
    tuning_winauthhl,
    tuning_turnonmichl,
    tuning_antivirushl,
    tuning_micsubmithl,
    tuning_goodtogostr,
    tuning_suggeststr,
    tuning_okbtn,
    ai_aitip,
    ai_aiswitchsw,
    ai_aidetstr,
    ai_trybtn,
    voice_inputlab,
    voice_outputlab,
    message_sendtopla,
    message_enterstr,
    message_nopermissionpla,
    emoji_stkrtip,
    upload_uploadtip,
    printscreen_deftip,
    printscreen_settip,
    message_unfoldtip,
    message_foldtip,
    message_tipstr,
    upload_albumbtn,
    upload_localbtn,
    message_atonlinebtn,
    message_atallbtn,
    message_atonlinestr,
    message_atallstr,
    message_atmestr,
    message_atauthonlinestr,
    message_atauthonlinestr_m,
    message_atauthallstr,
    message_atauthallstr_m,
    message_atauthrolestr,
    message_atauthrolestr_m,
    emoji_searchpla,
    emoji_nostkrstr,
    emoji_figurelab,
    emoji_naturelab,
    emoji_foodlab,
    emoji_sportlab,
    emoji_travellab,
    emoji_objectlab,
    emoji_symbollab,
    emoji_flaglab,
    message_historystr,
    message_latestbtn,
    message_cdstr,
    message_remitstr,
    message_amountstr,
    message_markasreadbtn,
    message_sendbtn,
    message_sendpla,
    message_escstr,
    message_reacttip,
    message_edtip,
    message_replytip,
    message_moretip,
    message_copybtn,
    message_delbtn,
    message_copyimgbtn,
    message_pastebtn,
    message_ededstr,
    message_fromtip,
    message_otherreactbtn,
    upload_dragtitle,
    upload_releasestr,
    upload_filenamestr,
    _fraudhl,
    channel_welcometitle,
    channel_invstr,
    channel_qrcodestr,
    channel_questionstr,
    channel_invbtn,
    channel_downloadbtn,
    channel_helpcenterbtn,
    server_boosteritem,
    server_settingitem,
    server_settingbtn_m,
    server_cchanitem,
    server_cgrpitem,
    server_changenameitem,
    server_hideitem,
    group_muteitem,
    group_mutetitle_m,
    group_closeitem,
    group_createitem,
    group_delitem,
    group_edititem,
    invite_invitem,
    channel_editem,
    channel_cloneitem,
    channel_delitem,
    channel_setpwitem,
    printscreen_occupytitle,
    printscreen_hotkeystr,
    printscreen_neveritem,
    printscreen_closebtn,
    printscreen_settingbtn,
    invite_creatinvtip,
    invite_invtitle,
    invite_invitedstr,
    invite_sharelinkstr,
    invite_copybtn,
    invite_copysusbtn,
    invite_linktimestr1,
    invite_linktimestr2,
    invite_linkcontistr,
    invite_linktimestr3,
    invite_linktimeday,
    invite_linktimemin,
    invite_linktimehour,
    invite_edhl,
    invite_durationlab,
    invite_selectpla,
    invite_timeslab,
    invite_newlinkbtn,
    invite_unlimedem,
    invite_neveritem,
    invite_timesitem,
    invite_duraminitem,
    invite_durahitem,
    invite_duradayitem,
    severmenu_overallitem,
    severmenu_boosteritem,
    severmenu_authitem,
    severmenu_logitem,
    severmenu_toolsitem,
    severmenu_safetyitem,
    severmenu_mbritem,
    severmenu_blacklistitem,
    severmenu_delitem,
    severoverview_gnllab,
    severoverview_userlab,
    severoverview_gnltitle,
    severoverview_changebtn,
    severoverview_arealab,
    severoverview_idlab,
    severoverview_idstr,
    severoverview_defchanlab,
    severoverview_defchanstr,
    severoverview_welcomechanlab,
    severoverview_welcomechanstr,
    severoverview_nodefitem,
    severoverview_nowelcomeitem,
    severoverview_bannerbtn,
    severoverview_checkbtn,
    severoverview_cdstr,
    severoverview_recommendedapplystr,
    severoverview_recommendedapplybtn,
    severoverview_recommendeditem_m,
    severoverview_notrecommendeditem_m,
    severoverview_recommendstr_m,
    severoverview_destitle,
    severoverview_destitle_m,
    severoverview_iconbtn,
    severoverview_iconitem_m,
    severoverview_coveragainbtn_m,
    severoverview_coverstr,
    severoverview_photoitem_m,
    severoverview_cameraitem_m,
    severoverview_defnotilab,
    severoverview_defnotistr,
    severoverview_allmesitem,
    severoverview_atmesitem,
    severoverview_recomserlab,
    severoverview_recomserstr,
    severoverview_averonlineminlab,
    severoverview_onlinemintip,
    severoverview_swcditem,
    severoverview_wshitem,
    severoverview_sszitem,
    severoverview_nbjitem,
    severoverview_asiahkitem,
    severoverview_intldomitem,
    severoverview_jamstr,
    severoverview_areaswtitle,
    severoverview_areaswstr,
    boost_notifylab,
    boost_notifystr,
    boost_serbslevelstr,
    boost_sertimestr,
    boost_bsbtn,
    boost_levelstr,
    boost_bsnumberstr,
    boost_serlevelstr,
    boost_currentstr,
    boost_equitystr,
    boost_needstr,
    boost_stkrnumstr,
    boost_voicekbpsstr,
    boost_uploadlimstr,
    boost_userlimstr,
    boost_bannerstastr,
    boost_pstkrnumstr,
    boost_pgifstkrstr,
    boost_giflogostr,
    boost_puserlimstr,
    boost_cusidstr,
    boost_gifbannerstr,
    boost_boosternumstr,
    boost_boosterchangestr,
    boost_serverlevelstr,
    boost_expirestr,
    boost_gracestr,
    boost_levelquitytitle,
    boost_bannerstr,
    boost_serstkrnumstr,
    boost_sergifnumstr,
    boost_cusstr,
    boost_givenstr,
    boost_gifstr,
    boost_ststr,
    boost_voicequalstr,
    boost_serverlogostr,
    boost_filesizestr,
    boost_userlimnumstr,
    boost_kbpsstr,
    boost_atallstr,
    roles_orderstr,
    roles_authhelpstr,
    roles_namelab,
    roles_colorlab,
    roles_settinglab,
    roles_distgshsw,
    roles_allowallatsw,
    roles_atnoticestr,
    roles_gnlauthlab,
    roles_adminsw,
    roles_adminstr,
    roles_mgrsw,
    roles_mgrstr,
    roles_mgrlogsw,
    roles_mgrlogstr,
    roles_linkstr,
    roles_invsw,
    roles_invstr,
    roles_chansw,
    roles_chanstr,
    roles_remsw,
    roles_remstr,
    roles_blacklistsw,
    roles_blackliststr,
    roles_cusstkrsw,
    roles_cusstkrstr,
    roles_chgnamesw,
    roles_chgnamestr,
    roles_chgothnmsw,
    roles_chgothnmstr,
    roles_authmagsw,
    roles_authmagstr,
    roles_checkchansw,
    roles_checkchanstr,
    roles_wordauthlab,
    roles_wordauthsw,
    roles_wordauthstr,
    roles_msgmagsw,
    roles_msgmagstr,
    roles_uploadsw,
    roles_uploadstr,
    roles_atallsw,
    roles_atallstr,
    roles_reactstr,
    roles_vocsw,
    roles_vocconnectsw,
    roles_vocconnectstr,
    roles_vocpsvsw,
    roles_vocpsvstr,
    roles_speaksw,
    roles_speakstr,
    roles_acpmntsw,
    roles_acpmntstr,
    roles_vocmagsw,
    roles_vocmagstr,
    roles_serdeafensw,
    roles_serdeafenstr,
    roles_sermutesw,
    roles_sermutestr,
    roles_vocactsw,
    roles_vocactstr,
    roles_clearauthbtn,
    roles_createitem_m,
    roles_createstr_m,
    emoji_sktuploadstr,
    emoji_sktuploadfftstr,
    emoji_sktuploadbtn,
    emoji_stsktstr,
    emoji_stgifstr,
    emoji_sktnamelab,
    emoji_uploaderlab,
    log_logmagstr,
    log_msgdelstr,
    log_msgdetstr,
    log_chanedstr,
    log_namechgstr,
    log_modechgstr,
    log_linkcreatestr,
    log_invcodestr,
    log_linkrecallstr,
    log_sftyrulesedstr,
    log_turnonstr,
    log_turnoffstr,
    log_setrolestr,
    log_cxlrolestr,
    log_edgrpauthstr,
    log_addgrpauthstr,
    log_remgrpauthstr,
    log_edchanauthstr,
    log_addchanauthstr,
    log_remchanauthstr,
    log_createrolestr,
    log_edrolestr,
    log_edroleauthstr,
    log_namechgfstr,
    log_colorchgstr,
    log_delrolestr,
    log_creategroupstr,
    log_edgroupstr,
    log_delgroupstr,
    log_createchanstr,
    log_delchanstr,
    log_descchgtostr,
    log_vocqualstr,
    log_hcchgtostr,
    log_banstr,
    log_reasonstr,
    log_unbanstr,
    log_kickstr,
    log_turnonpwstr,
    log_chanpwisstr,
    log_chgchanpwstr,
    log_turnoffchanpwstr,
    widget_sertoolstitle,
    widget_sertoolssw,
    widget_jsonapilab,
    widget_invchanlab,
    widget_noinvitem,
    widget_themeslab,
    widget_darkitem,
    widget_brightitem,
    widget_invlinkstr,
    widget_premadelab,
    widget_premadestr,
    security_riskstr,
    security_rulelistlab,
    security_addrulebtn,
    security_defrulesw,
    security_prohibitstr,
    security_edititem,
    security_delitem,
    security_halfhourstr,
    security_nonmluserstr,
    security_recidivismstr,
    security_highriskitem,
    security_addbtn,
    security_edittip,
    security_hourminitem,
    security_minitem,
    security_msgvocstr,
    security_msgeditstr,
    security_vocconnectstr,
    security_savebtn,
    members_sermbrtitle,
    members_limstr,
    members_mbrstr,
    members_mbrstr_m,
    members_batbtn,
    members_contentstr,
    members_userroleitem,
    members_dataitem,
    members_filterstr,
    members_filteritem_m,
    members_unauthitem,
    members_sortstr,
    members_joinascitem,
    members_joindescitem,
    members_actvascitem,
    members_actvdescitem,
    members_roleitem,
    members_batselbtn,
    members_addrolebtn,
    members_delrolebtn,
    members_addblacklistbtn,
    members_transferitem,
    invite_invrecallstr,
    invite_invuserlab,
    invite_invcodelab,
    invite_usagecountlab,
    invite_expdtimelab,
    bans_defblacklisttitle,
    bans_blacklisttitle,
    bans_blackliststr,
    bans_noblockusertitle,
    bans_noblockuserstr,
    bans_noblockuser2str,
    bans_reasonstr,
    bans_removebtn,
    bans_donebtn,
    usermenu_acctsettingitem,
    usermenu_authitem,
    usermenu_bufflab,
    usermenu_actbuffitem,
    usermenu_mybillsitem,
    usermenu_mybillsbtn_m,
    usermenu_codeitem,
    usermenu_appitem,
    usermenu_vocitem,
    usermenu_hotkeyitem,
    usermenu_sktitem,
    usermenu_overlayitem,
    usermenu_notifiitem,
    usermenu_themesitem,
    usermenu_themesitem_m,
    usermenu_toolsitem,
    usermenu_advanceitem,
    usermenu_activityitem,
    usermenu_windowsitem,
    usermenu_updatelogitem,
    usermenu_logoutitem,
    account_bannerlab,
    account_uploadbannerlab,
    account_bannerstr,
    account_portraitlab,
    account_portrait_m,
    account_buffendstr,
    account_usernamestr,
    account_namechgcdstr,
    account_phonelab,
    account_phoneitem_m,
    account_phonetitle_m,
    account_thirdpartylab,
    account_unlinkphonbtn,
    account_linkbtn,
    account_safetylab,
    account_cxlbtn,
    account_bufftip,
    account_bannerbtn,
    account_removebannerlab,
    account_confirmtip,
    account_removebannerbtn,
    sever_removebtn,
    account_editnametitle,
    account_nameidstr,
    account_rdmnumbtn,
    account_namecdstr,
    account_namecdstr_m,
    account_namecdtip,
    account_verifcodetitle,
    account_wfmtstr,
    account_nextbtn,
    account_verifytitle,
    account_movepla,
    account_loadingstr,
    account_authedstr,
    account_reacqsecstr,
    account_linknewphonetitle,
    account_linkphonelab,
    account_alreadyinusestr,
    account_changepwlab,
    account_sendcodestr,
    account_verficodelab,
    account_newpwlab,
    account_pwlimitpla,
    account_unlinkbtn,
    account_wechatconfstr,
    account_qqconfstr,
    account_wechatqrstr,
    account_wechatstr,
    account_wechatstr_m,
    account_kaiheilatitle,
    account_cxlnoticestr,
    account_safetysitulab,
    account_safetysitustr,
    account_normsitulab,
    account_normsitustr,
    account_noserlab,
    account_noserstr,
    account_nobotlab,
    account_nobotstr,
    privacy_settingstr,
    privacy_defserlab,
    privacy_sertitle,
    privacy_sermsgsw,
    privacy_sersittingapplystr,
    privacy_addfriendlab,
    privacy_allsw,
    privacy_friendfrisw,
    privacy_uxlab,
    privacy_uxsw,
    privacy_uxstr,
    privacy_agreementstr,
    authorized_authappstr,
    authorized_devcenterlab,
    authorized_brieflab,
    authorized_authlab,
    authorized_allowinfostr,
    authorized_cancelbtn,
    authorized_obslab,
    authorized_remotecallstr,
    authorized_readsermsgstr,
    invite_invstr,
    invite_myinverlab,
    invite_notfilledstr_m,
    invite_invcodeinputpla,
    invite_confirmbtn,
    invite_confirmbtn_m,
    invite_myinvcodestr,
    invite_invlinkregstr,
    invite_invidentilab_m,
    invite_invidentistr,
    invite_approachlab,
    invite_enterserstr,
    invite_invbuttonstr,
    invite_copylinkstr,
    buff_endsstr,
    buff_renewbtn,
    buff_giftbtn,
    buff_equitystr,
    buff_effecttitle,
    buff_settitle,
    buff_bannerlab,
    buff_bannerstr,
    buff_gifportraitlab,
    buff_gifportraitlab_m,
    buff_gifportraitstr,
    buff_crosssersktlab,
    buff_crosssersktstr,
    buff_higeruploadlimitlab,
    buff_higeruploadlimitlab_m,
    buff_higeruploadlimitstr,
    buff_intlvoclab,
    buff_intlvocstr,
    buff_cusnumlab,
    buff_cusnumstr,
    buff_uniquelab,
    buff_uniquestr,
    buff_morehl,
    buff_bufftitle,
    buff_timelab,
    buff_timestr,
    buff_renewlab,
    buff_renewstr,
    buff_paylab,
    buff_paymentstr,
    buff_giftlab,
    buff_giftstr,
    buff_buffstr,
    buff_buyitnowbtn,
    buff_actbufftitle,
    buff_bufftimelab,
    buff_discountstr,
    buff_annualstr,
    buff_semiannualstr,
    buff_seasonalstr,
    buff_monthlystr,
    buff_paymentlab,
    buff_alipaybtn,
    buff_amountstr,
    buff_rmbstr,
    buff_aggrementhl,
    buff_selectfriendlab,
    buff_activated_m,
    buff_nonactivated_m,
    buff_bufftitle_m,
    boost_boosttitle,
    boost_booststr,
    boost_unusedlab,
    boost_usenowbtn,
    boost_purchasebtn,
    boost_serequitytitle,
    boost_serbooststr,
    boost_uniqueidentitystr,
    boost_badgestr,
    boost_uniquerolestr,
    boost_boosterserstr,
    boost_moresersktstr,
    boost_highervocqualitystr,
    boost_highersizelimstr,
    boost_serequitystr,
    boost_pricestr,
    boost_numbooststr,
    boost_buyboosttitle,
    boost_durationstr,
    boost_discountstr,
    boost_aggrementstr,
    boost_serboosttitle,
    boost_selectnumstr,
    boost_neednumstr,
    boost_usebtn,
    boost_succtitle,
    boost_succstr,
    boost_currenttitle,
    boost_startatstr,
    boost_usedstr,
    billing_reportbtn,
    billing_datelab,
    billing_productlab,
    billing_purposelab,
    billing_monthbuffstr,
    billing_daybuffstr,
    billing_triduumbuffstr,
    billing_monthbooststr,
    billing_wechatpaystr,
    billing_selfusestr,
    billing_amountstr,
    billing_billnumstr,
    billing_methodstr,
    billing_datestr,
    billing_questionhl,
    billing_tipslab,
    billing_tipsstr,
    cdk_giftcardstr,
    cdk_giftcardpla,
    cdk_nullcdkstr,
    cdk_shortcdkstr,
    cdk_longcdkstr,
    cdk_wrongcdkstr,
    cdk_collectbtn,
    cdk_succtitle,
    cdk_succstr,
    voice_autosyssw,
    voice_autosysstr,
    voice_micvoclab,
    voice_strstr,
    voice_dbstr,
    voice_vocoutputlab,
    voice_aidescstr,
    voice_inputlab_m,
    voice_keyitem_m,
    voice_speakeritem_m,
    voice_keylab_m,
    voice_keybtn_m,
    voice_keyupliftlab_m,
    voice_autodetnsw,
    voice_exceedstr,
    voice_micswitchlab,
    voice_nohotkeypla,
    voice_resetbtn,
    voice_deafenlab,
    voice_vocimprovetitle,
    voice_echosw,
    voice_noisesw,
    voice_aistr,
    voice_micenhancesw,
    keybinds_hotkeystr,
    keybinds_texttitle,
    keybinds_textlab,
    keybinds_enteritem,
    keybinds_ctrlenteritem,
    keybinds_voctitle,
    keybinds_vochotkeylab,
    keybinds_screenshottitle,
    keybinds_scrsstr,
    keybinds_mouseustr,
    keybinds_fsscrsstr,
    emoji_stklovestr,
    emoji_edittitle_m,
    emoji_stkaddedbtn,
    emoji_stknotaddedbtn,
    emoji_dragorderstr,
    emoji_addsktbtn,
    overlay_descpstr,
    overlay_explstr,
    overlay_localab,
    overlay_clicklocastr,
    overlay_portraitsizelab,
    overlay_defsizestr,
    overlay_maxstr,
    overlay_displaylab,
    overlay_alwaysitem,
    overlay_onlyspeakitem,
    overlay_faqlab,
    overlay_faqstr,
    notificatios_desktopsw,
    notificatios_desktopstr,
    notificatios_inboxsw,
    notificatios_inboxstr,
    notificatios_phonenotilab,
    notificatios_alwaysitem,
    notificatios_fiveminitem,
    notificatios_tenminitem,
    notificatios_fifteenitem,
    notificatios_neveritem,
    notificatios_tonesw,
    notificatios_volumesw,
    notificatios_notificationsw,
    notificatios_deafensw,
    notificatios_undeafensw,
    notificatios_mutesw,
    notificatios_unmutesw,
    notificatios_disconnectedsw,
    notificatios_pttactsw,
    notificatios_pttdeacsw,
    notificatios_joinsw,
    notificatios_leavesw,
    notificatios_printscreensw,
    appearance_appearancesw,
    appearance_darkitem,
    appearance_lightitem,
    appearance_autosw,
    appearance_lightlab,
    appearance_darklab,
    appearance_autosw_m,
    tool_desstr,
    tool_printscreentitle,
    tool_savectlglab,
    tool_chgbtn,
    tool_openctlgbtn,
    tool_livetitle,
    tool_livestr,
    tool_obsstr,
    tool_connectbtn,
    obs_stateitem,
    obs_textitem,
    obs_voiceitem,
    obs_onlinenumsw,
    obs_severiconsw,
    obs_invitesw,
    obs_methodlab,
    obs_linkitem,
    obs_appearancelab,
    obs_darkitem,
    obs_fullbtn,
    obs_urlstr,
    obs_sizestr,
    obs_textchannellab,
    obs_fontlab,
    obs_fontsizelab,
    obs_voicechannel,
    obs_headitem,
    obs_ptgitem,
    obs_speakshowsw,
    obs_nicknamesw,
    obs_headsw,
    obs_combinationlab,
    obs_leftitem,
    obs_toplitem,
    obs_poslab,
    obs_sortlab,
    obs_vrtitem,
    obs_horitem,
    obs_cusizepositem,
    obs_spacelab,
    obs_stylelab,
    obs_nicknamefontsizelab,
    obs_nicknamefontlab,
    obs_defitem,
    obs_fontstr,
    obs_otherlab,
    obs_bubblesw,
    obs_shadowsw,
    obs_lightsw,
    obs_colourlab,
    obs_resetbtn,
    advanced_devsw,
    advanced_devcopyiditem,
    advanced_devstr,
    advanced_undetectablestr,
    status_playstr,
    status_unseenstr,
    status_addbtn,
    status_gamesw,
    status_musicsw,
    status_selectgamepla,
    status_addgamebtn,
    status_backbtn,
    status_playingstr,
    windows_autostartsw,
    windows_autostartstr,
    windows_minimizesw,
    windows_minimizestr,
    windows_traysw,
    windows_traystr,
    windows_dxvasw,
    windows_dxvastr,
    update_updatestr,
    update_versionstr,
    quit_quitstr,
    textoverview_channelnamelab,
    textoverview_channeldeslab,
    textoverview_channelnamepla,
    textoverview_channeldespla,
    textoverview_lowlab,
    textoverview_close,
    textoverview_lowstr,
    textoverview_savestr,
    textoverview_giveupbtn,
    textoverview_savebtn,
    roles_rolepla,
    roles_categstr,
    roles_categchangestr,
    roles_categstrbtn,
    channeldel_deltitle,
    channeldel_delstr,
    voiceoverview_qualitylab,
    voiceoverview_fluencylab,
    voiceoverview_normallab,
    voiceoverview_highlab,
    voiceoverview_maxlab,
    voiceoverview_unlimitlab,
    password_opensw,
    password_formatpla,
    password_inputtitle,
    password_inputpla,
    password_passworderror,
    copy_channelnametitle,
    copy_copystr,
    copy_nullerror,
    createserver_createtitle,
    createserver_createservertitle1,
    createserver_createstr,
    createserver_createbtn,
    createserver_createbtn_m,
    createserver_jointitle1,
    createserver_joinstr1,
    createserver_joinbtn,
    createserver_tpltitle,
    createserver_tplstr,
    createserver_freedombtn,
    createserver_selectlab,
    createserver_frienditem,
    createserver_guilditem,
    createserver_communityitem,
    createserver_fansitem,
    createserver_study,
    createserver_tplchannellab,
    createserver_tplrolelab,
    createserver_tplpreviewlab_m,
    createserver_gmrolestr,
    createserver_textgmstr,
    createserver_voicegmstr,
    createserver_textchannelgmstr,
    createserver_voicechannelgmstr,
    createserver_selectbtn,
    createserver_createservertitle2,
    createserver_createserverstr,
    createserver_updatelogobtn,
    createserver_uploadlogobtn,
    createserver_uploadlogobtn_m,
    createserver_iconsizestr1,
    createserver_iconsizestr2,
    createserver_servernamelab,
    createserver_servernamepla,
    joinserver_jointitle2,
    joinserver_jointitle2_m,
    joinserver_inputlab_m,
    joinserver_completelink,
    joinserver_completestr,
    joinserver_simplifylink,
    joinserver_simplifystr,
    joinserver_minimallink,
    joinserver_minimalstr,
    joinserver_idlink,
    joinserver_idstr,
    joinserver_idinputpla,
    joinserver_Invalidcodeerror,
    sever_leavetitle,
    sever_leavestr,
    server_muteitem,
    folder_readitem,
    folder_settingitem,
    folder_namelab,
    folder_namepla,
    folder_colourlab,
    folder_cuscolourtip,
    user_profileitem,
    user_mentionitem,
    user_invitevoiceitem,
    user_noteitem,
    user_privatemessageitem,
    user_uservolumeitem,
    user_inviteserveritem,
    user_addfrienditem,
    user_sentfrienditem,
    user_kickitem,
    user_banitem,
    user_kickvoiceitem,
    user_movetoitem,
    user_blockuseritem,
    profile_block,
    profile_introlab,
    profile_notepla,
    profile_norolelab,
    profile_viewprofilebtn,
    profile_listeninglab,
    profile_playinglab,
    profile_playingtimestr,
    profile_intropla,
    profile_changenicknameotherstr,
    profile_nicknamelab,
    profile_resetnicknamebtn,
    profile_submitbtn,
    search_advancedsearchbtn,
    search_messageitem,
    search_fileitem,
    search_picturevideoitem,
    search_resultstr,
    search_skipbtn,
    search_searchingstr1,
    search_searchingstr2,
    search_emptystr1,
    search_emptystr2,
    search_allchannelitem,
    search_generalitem,
    search_useritem,
    search_channelitem,
    search_servermessageitem,
    search_rangelab,
    search_categorystr,
    search_movestr,
    search_selectitemstr,
    search_escstr,
    search_searchpla,
    search_keywordstr,
    search_selectrangetitle,
    search_selectserverlab,
    search_channelrangelab,
    "//3": __3,
    undefined: undefined2,
    search_designatedchannelitem,
    search_messagetypelab,
    search_texttypeitem,
    search_picturevideotypeitem,
    search_allprivatemessageitem,
    search_designatedprivatemessageitem,
    feedback_friendstr,
    feedback_servermenustr,
    feedback_channelliststr,
    feedback_serverliststr,
    feedback_discoverstr,
    feedback_desstr,
    feedback_faqlab,
    feedback_helpbtn,
    feedback_mfaqitem_m,
    feedback_helpstr_m,
    feedback_feedbackstr_m,
    feedback_otherlab,
    feedback_feedbacktitle,
    feedback_typelab,
    feedback_troubleitem,
    feedback_adviseitem,
    feedback_platformlab,
    feedback_questiontypelab,
    feedback_deslab,
    feedback_troubledespla,
    feedback_advisepla,
    feedback_deviceinfolab,
    feedback_loglab,
    feedback_pcitem,
    feedback_webitem,
    feedback_androiditem,
    feedback_iositem,
    feedback_h5item,
    feedback_tyoeitem,
    feedback_voiceitem,
    feedback_textitem,
    feedback_accountitem,
    feedback_serveritem,
    feedback_billitem,
    feedback_other,
    feedback_despla,
    feedback_deserror,
    message_topnumstr,
    message_topdefaultstr,
    message_allreadbtn,
    message_nomorestr,
    messagebox_newmessagenumstr,
    messagebox_overlookallbtn,
    messagebox_mentionstr,
    messagebox_friendrequestitem,
    friends_hotkeyckstr,
    friends_frienditem,
    friends_allitem,
    friends_requestitem,
    friends_blockeditem,
    friends_requeststr,
    friends_noawaitingstr,
    friends_emptyflstr,
    friends_emptyblstr,
    friends_noonlinestr,
    friends_deltitle,
    friends_delitem,
    friends_confirmstr,
    friends_addfriendstr,
    friends_tempmsgstr,
    friends_msgtopstr,
    friends_friendstr,
    friends_invsentstr,
    friends_invrecstr,
    friends_invexpiredtitle,
    friends_fourofourstr,
    friends_serinvsentstr,
    friends_serinvacceptstr,
    friends_onlinestr,
    friends_joinedstr,
    friends_reportitem,
    friends_reasontitle,
    friends_personalinfostr,
    friends_pornlab,
    friends_advertislab,
    friends_harassmentlab,
    friends_dislikelab,
    friends_otherpla,
    discover_interestpla,
    discover_officialsertitle,
    discover_topbtn,
    discover_checkbtn,
    discover_promotebtn,
    discover_promotestr,
    discover_loadingtitle,
    featured_recomsertitle,
    featured_criteriastr,
    featured_memberstr,
    featured_membernumstr,
    featured_avgonlinestr,
    featured_timestr,
    featured_aggrementstr,
    featured_notestr,
    featured_nonserarrivedstr,
    featured_fulfillstr,
    featured_applyinfostr,
    featured_serclasslab,
    featured_serclasstip,
    featured_serbannerstr,
    featured_serbannerlab,
    featured_minsizestr,
    featured_serdescstr,
    featured_sertaglab,
    featured_serdesclab,
    featured_selsertaglab,
    featured_backbtn,
    featured_applybtn,
    featured_descpla,
    featured_guildnametip,
    featured_nosuittagstr,
    featured_newtaghl,
    featured_tagapplytitle,
    featured_inputnametagstr,
    featured_namestr,
    featured_nullnamestr,
    featured_gamenamepla,
    featured_gameclasslab,
    featured_gameclasspla,
    featured_submitsuccstr,
    featured_inonebusstr,
    featured_guilditem,
    featured_fanclubitem,
    featured_cmtyitem,
    featured_officalitem,
    featured_submittedstr,
    featured_onebusawaitstr,
    download_iosstr,
    download_dlnowbtn,
    download_androidstr,
    download_qriosstr,
    download_qrandroidstr,
    tab_homelab_m,
    tab_profilelab_m,
    server_boosterbtn_m,
    sever_modifynickname_m,
    sever_allowprivatesw_m,
    invite_friendlistlab_m,
    invite_sharelinklab_m,
    invite_copylinkbtn_m,
    invite_qqstr_m,
    invite_qqzonestr_m,
    invite_wxstr_m,
    invite_circlestr_m,
    friends_newstr_m,
    friends_blockstr_m,
    friends_nullblockstr_m,
    friends_nullpendingstr_m,
    friends_searchpla_m,
    friends_addlab_m,
    friends_addtipstr_m,
    friends_sendbtn_m,
    message_photobtn_m,
    message_previewbtn_m,
    message_originallab_m,
    message_searchpla_m,
    message_latelylab_m,
    message_selectmentiontitle_m,
    user_aboutkhlitem_m,
    channel_sort_m,
    voice_balllab_m,
    voice_ballstr_m,
    voice_ballsw_m,
    voice_ballpermissionitem_m,
    voice_deniedstr_m,
    voice_allowstr_m,
    voice_allowfloatingwindowitem_m,
    voice_accessrecord_m,
    voice_balldenied_m,
    voice_disabletouchscreensw_m,
    privacy_personaltitle_m,
    privacy_photolab_m,
    privacy_photostr_m,
    privacy_cameralab_m,
    privacy_camerastr_m,
    privacy_microphonelab_m,
    privacy_microphonestr_m,
    privacy_locationlab_m,
    privacy_locationstr_m,
    privacy_systemtitle_m,
    privacy_systemstr_m,
    privacy_gosystembtn_m,
    privacy_thirdpartiesitem_m,
    privacy_directorytitle_m,
    user_aboutuseragreementitem_m,
    user_aboutprivacyagreementitem_m,
    user_checkitem_m,
    voice_wyyrestarttitle,
    voice_wyyrestarstr,
    voice_wyyrestarbtn,
    update_updatetitle,
    update_updatetip,
    update_updatebtn,
    voice_canthearstr,
    voice_clickdebugbtn,
    voice_nodevicetitle,
    voice_nodevicestr,
    privacy_agreementupdate1title,
    privacy_agreementupdate2title,
    privacy_agreementupdate3title,
    privacy_agreementupdate1str,
    privacy_agreementupdate2str,
    privacy_agreementupdate3str,
    privacy_agreementupdateokbtn,
    privacy_agreementupdatenobtn,
    kmd_blodtip,
    kmd_italictip,
    kmd_strikethroughtip,
    kmd_underlinetip,
    kmd_linktip,
    kmd_quotetip,
    kmd_spoilertip,
    kmd_inlinecodetip,
    kmd_codeblocktip,
    kmd_richtexttip,
    channel_syncpermissiontitle,
    channel_syncpermissionstr,
    channel_syncpermissionstr_m,
    channel_syncpermissionbtn,
    channel_createtexttitle,
    channel_createvoicetitle,
    channel_createtypelab,
    message_downloadstr,
    message_uploadsusstr,
    voice_mutestr,
    voice_deafenstr,
    invite_joinedpsstr,
    sever_ruledelstr,
    voice_unmutedstr,
    voice_undeafenstr,
    voice_pushtotalkstr,
    voice_noserverstr,
    voice_noseatavailablestr,
    voice_noauthtospeakstr,
    voice_noauthtoconnecstr,
    voice_noauthtochangestr,
    voice_noaccessmicstr,
    voice_mutedstr,
    voice_movedstr,
    voice_modeselectedstr,
    voice_invservermutedstr,
    voice_hmdisconnectedstr,
    voice_headphonemodestr,
    voice_failtojoinstr,
    voice_disconnectedstr,
    voice_deafenedstr,
    voice_commentedstr,
    voice_chatinvstr,
    voice_chatinvrecievestr,
    voice_chanpushtotalkswitchstr,
    voice_chanpushtotalkstr,
    voice_channelmodechangedstr,
    voice_btscounsupportedstr,
    user_updatesuccessstr,
    user_failacquireinfostr,
    user_accountcanceledstr,
    user_accessauthinfofailedstr,
    upload_uploadfailstr,
    upload_takephotobtn,
    upload_sizelimitstr,
    upload_selectimgstr,
    upload_resourcesstr,
    upload_reselectedstr,
    upload_readerrorstr,
    upload_photoalbumbtn,
    upload_oversizestr,
    upload_oversizedstr,
    "//4": __4,
    upload_numimgoversizedstr,
    upload_noawaitingdlstr,
    upload_noauthuploadstr,
    upload_noaccesscamstr,
    upload_noaccessalbumstr,
    upload_filesavepsstr,
    upload_failedstr,
    upload_dlsuccessstr,
    upload_dlfailedstr,
    upload_checkalbumstr,
    update_updatenowbtn,
    update_acceptbtn,
    update_rejectbtn,
    update_newversionstr,
    update_latestversionstr,
    update_downloadfailedstr,
    share_sharetitle,
    sever_uperlimit32str,
    sever_unblockuserstr,
    sever_unblockuserconfirmstr,
    sever_turnoffidstr,
    sever_transferstr,
    sever_transfernoticstr,
    sever_succtokickstr,
    sever_succtoblockstr,
    sever_serverinfofailstr,
    sever_safemodeonstr,
    sever_ruleslimitstr,
    sever_rulesavedstr,
    sever_removeuserauthstr,
    sever_removememauthstr,
    sever_removeauthconfirmstr,
    sever_remainsamestr,
    sever_quittedstr,
    sever_oldversionstr,
    sever_nullrulenamestr,
    sever_namelowerlimitstr,
    sever_lowerlimit6str,
    sever_inputservernamestr,
    sever_illegalnamestr,
    sever_illegalformstr,
    sever_idoutdatedstr,
    sever_idoccupiedstr,
    sever_failedtokickstr,
    sever_failedtoblockstr,
    sever_denynoauthstr,
    sever_deletedstr,
    sever_asdeleteconfirmstr,
    server_verifiedstr,
    server_turnoffpvmsgbtn,
    server_transfersuccessstr,
    server_transferconfirmstr,
    server_transferbtn,
    server_rightslidestr,
    server_quitconfirmstr,
    server_nowordchannelstr,
    server_namecdstr,
    channel_confirmtransferasurestr,
    profile_wordlimit500str,
    privacy_leakagestr,
    pay_successstr,
    pay_noproductinfostr,
    pay_failstr,
    pay_canceledstr,
    message_unabletoeditbtn,
    message_stickymsgcanceledstr,
    message_slowmodeenablestr,
    message_sendingstr,
    message_savetoalbumbtn,
    message_resentbtn,
    message_reactionbtn,
    message_quotemsgbtn,
    message_nullmsgstr,
    message_nostinkymsgstr,
    message_nostickymsgstr,
    message_msgremovalstr,
    message_linkremovalpmstr,
    message_linkdeletedstr,
    message_linkdeleteconfirmstr,
    message_failtoloadvoicestr,
    message_delstinkymsgstr,
    message_delstinkymsgconfirmstr,
    message_avoidchannelatmsgstr,
    message_atmsgbtn,
    logingiveupbtn,
    login_verifiedstr,
    login_recoverybtn,
    login_phrasestr,
    login_phonenumchangedstr,
    login_logoutbtn,
    login_loginstr,
    login_confirmstr,
    login_clientnotinstallstr,
    login_cancelcdstr,
    login_authcodesentstr,
    login_agreementcbstr,
    invite_voicechaninvstr,
    invite_sharesusstr,
    invite_sentstr,
    invite_nullinvlinkstr,
    invite_noinvlinkstr,
    invite_noaccessstr,
    invite_invsentstr,
    invite_invrecieveoutdatedstr,
    invite_invoutdatedstr,
    invite_copysusstr,
    invite_copiedstr,
    group_nullnamestr,
    group_groupbtn,
    general_updatesuccstr,
    general_tempunsuppotedstr,
    general_sentstr,
    general_savedstr,
    general_retrystr,
    general_quitconfirmstr,
    general_plzinputstr,
    general_nullinfostr,
    general_noticestr,
    general_interneterrorstr,
    general_interneterrormsgstr,
    general_failtodeletestr,
    general_failedtosavestr,
    general_failedtogetfilestr,
    general_failedtoapplystr,
    general_deletedsuccstr,
    general_dataerrorstr,
    general_currenttimestr,
    general_cantdealappstr,
    general_appsentstr,
    general_addsuccstr,
    friends_unblockbtn,
    friends_reportsusstr,
    friends_reported24hoursstr,
    friends_nopvmsgstr,
    friends_msgrejectstr,
    friends_keeprecordstr,
    friends_deniedstr,
    friends_deletestr,
    friends_deletedstr,
    friends_deleteconfirmstr,
    friends_blockconfirmstr,
    friends_blockndeletestr,
    friends_acceptedstr,
    friend_strmsgdisabledstr,
    friend_privatmsgstr,
    friend_privatchannelstr,
    friend_blocksusstr,
    friend_blockremovesusstr,
    feedback_sheetsubmitedstr,
    feedback_savesheetstr,
    feedback_inputprobserverstr,
    feedback_failsubmitsheetstr,
    explorer_outsidelinkstr,
    explorer_leavestr,
    emoji_noserverstickerstr,
    emoji_noavailablegifstr,
    emoji_noaddedstickerstr,
    emoji_namelimitstr,
    emoji_allstickeraddedstr,
    channel_turnoffchanpwstr,
    channel_switchchanmodestr,
    channel_nullstr,
    channel_clearchanpwstr,
    account_wrongpwstr,
    account_unlowerlimitstr,
    account_unlink3rdaccstr,
    account_pwupdatedstr,
    account_portraitoversiedstr,
    account_phoneusedstr,
    account_nullpwstr,
    account_nameupperlimit2str,
    account_cancelconfirmstr,
    account_canagreementstr,
    account_buffstr,
    account_buffremovalstr,
    account_boosterstr,
    country_cnitem,
    country_usitem,
    country_jpitem,
    "//5": __5,
    country_hkitem,
    country_moitem,
    country_twitem,
    country_myitem,
    country_auitem,
    country_caitem,
    country_gbitem,
    country_sgitem,
    country_deitem,
    country_ruitem,
    country_egitem,
    country_zaitem,
    country_gritem,
    country_nlitem,
    country_beitem,
    country_fritem,
    country_esitem,
    country_huitem,
    country_ititem,
    country_roitem,
    country_chitem,
    country_atitem,
    country_dkitem,
    country_seitem,
    country_noitem,
    country_plitem,
    country_peitem,
    country_mxitem,
    country_cuitem,
    country_aritem,
    country_britem,
    country_clitem,
    country_coitem,
    country_veitem,
    country_iditem,
    country_phitem,
    country_nzitem,
    country_thitem,
    country_kzitem,
    country_kritem,
    country_vnitem,
    country_tritem,
    country_initem,
    country_pkitem,
    country_afitem,
    country_lkitem,
    country_mmitem,
    country_iritem,
    country_maitem,
    country_dzitem,
    country_tnitem,
    country_lyitem,
    country_gmitem,
    country_snitem,
    country_mlitem,
    country_gnitem,
    country_clvitem,
    country_bfitem,
    country_neitem,
    country_tgitem,
    country_bjitem,
    country_muitem,
    country_lritem,
    country_slitem,
    country_ghitem,
    country_ngitem,
    country_tditem,
    country_cfitem,
    country_cmitem,
    country_stitem,
    country_gaitem,
    country_cgitem,
    country_aoitem,
    country_ascensionitem,
    country_scitem,
    country_sditem,
    country_etitem,
    country_soitem,
    country_djitem,
    country_keitem,
    country_tzitem,
    country_ugitem,
    country_biitem,
    country_mzitem,
    country_zmitem,
    country_mgitem,
    country_zwitem,
    country_naitem,
    country_mwitem,
    country_lsitem,
    country_bwitem,
    country_szitem,
    country_giitem,
    country_ptitem,
    country_luitem,
    country_ieitem,
    country_isitem,
    country_alitem,
    country_mtitem,
    country_cyitem,
    country_fiitem,
    country_bgitem,
    country_ltitem,
    country_lvitem,
    country_eeitem,
    country_mditem,
    country_amitem,
    country_byitem,
    country_aditem,
    country_mcitem,
    country_smitem,
    country_uaitem,
    country_siitem,
    country_csitem,
    country_skitem,
    country_liitem,
    country_bzitem,
    country_gtitem,
    country_svitem,
    country_hnitem,
    country_niitem,
    country_critem,
    country_paitem,
    country_htitem,
    country_boitem,
    country_gyitem,
    country_ecitem,
    country_gfitem,
    country_pyitem,
    country_mqitem,
    country_sritem,
    country_uyitem,
    country_bnitem,
    country_pgitem,
    country_toitem,
    country_sbitem,
    country_fjitem,
    country_ckitem,
    country_pomitem,
    country_khitem,
    country_laitem,
    country_bditem,
    country_mvitem,
    country_lbitem,
    country_joitem,
    country_syitem,
    country_iqitem,
    country_kwitem,
    country_saitem,
    country_yeitem,
    country_omitem,
    country_aeitem,
    country_ilitem,
    country_bhitem,
    country_qaitem,
    country_mnitem,
    country_npitem,
    country_tjitem,
    country_tmitem,
    country_azitem,
    country_geitem,
    country_kgitem,
    country_uzitem,
    country_bsitem,
    country_bbitem,
    country_aiitem,
    country_agitem,
    country_caymanitem,
    country_bmitem,
    country_gditem,
    country_msitem,
    country_guitem,
    country_lcitem,
    country_pritem,
    country_doitem,
    country_ttitem,
    country_jmitem,
    country_serbiaitem,
    country_mauritaniaitem,
    cancel_link,
    remove_style
  };

  // src/en_translate/constants.ts
  var constants_default = () => {
    const original = Object.assign({}, common_default.constantsCN);
    Object.assign(common_default.constantsCN, EN_CONSTANTS_default);
    return () => Object.assign(common_default.constantsCN, original);
  };

  // src/en_translate/index.ts
  var en_translate_default = () => {
    const patches = [constants_default()];
    return () => _.forEachRight(patches, (p) => p());
  };

  // src/utils.ts
  function reactFiberWalker(node, prop, goUp = false) {
    if (!node)
      return;
    if (node.pendingProps?.[prop] !== void 0)
      return node;
    if (goUp) {
      const ret = reactFiberWalker(node.return, prop, goUp);
      if (ret)
        return ret;
    } else {
      const ret = reactFiberWalker(node.child, prop, goUp);
      if (ret)
        return ret;
    }
    return reactFiberWalker(node.sibling, prop, goUp);
  }
  var getFiber = (node) => node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
  var sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  var getComponentFromDom = async (className) => {
    let element;
    while (!element) {
      element = document.getElementsByClassName(className)[0];
      await sleep(100);
    }
    const walk = (node) => typeof node.type === "function" ? node : walk(node.return);
    return walk(getFiber(element)).type;
  };
  var startsNotAscii = (text) => (text.charCodeAt(0) & 65408) > 0;
  var utils_default = {
    reactFiberWalker,
    getFiber,
    sleep,
    getComponentFromDom,
    startsNotAscii
  };

  // src/index.ts
  if (window.kaihax) {
    console.clear();
    console.log("Kaihax already loaded, uninjecting first");
    kaihax.uninject();
  }
  var untranslate = en_translate_default();
  window.kaihax = {
    modules: {
      webpack: webpack_default,
      common: common_default
    },
    patcher: {
      after: patcher_default.after,
      before: patcher_default.before,
      instead: patcher_default.instead,
      observe: patcher_default.observe
    },
    utils: utils_default,
    uninject: () => {
      patcher_default.unpatchAll();
      patcher_default.unobserve();
      untranslate();
      delete window.kaihax;
    }
  };
  console.log("Kaihax loaded");
})();
//# sourceURL=Kaihax