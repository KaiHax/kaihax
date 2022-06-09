(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
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
    for (const record of records) {
      const elem = record.type === "characterData" ? record.target.parentElement : record.target;
      if (elem)
        changedElems.add(elem);
    }
    for (const elem of changedElems)
      for (const [sel, cb] of observations)
        if (elem.matches(sel))
          cb(elem);
  });
  observer.observe(document.getElementById("root"), {
    subtree: true,
    childList: true,
    characterData: true
  });
  var patcher_default = {
    ...esm_exports,
    observe: (cb, sel) => observations.add([sel, cb]),
    unobserve: () => {
      observations.clear();
      observer.disconnect();
    }
  };

  // src/en_translate/constants.ts
  var overrides = {
    click_refresh: "Click to refresh",
    add: "Add",
    added: "Added",
    remove: "Remove",
    app_name: "Kaiheila (\u5F00\u9ED1\u5566)",
    prompt: "Tips",
    confirm: "Confirm",
    ok: "OK",
    cancel: "Cancel",
    home_page: "Home page",
    friend: "Friends",
    add_friend: "Add friend",
    remove_friend: "Remove friend",
    remove_friend_description: "Are you sure you want to remove {{username}} from your friends list?",
    online: "Online",
    all: "All",
    requested: "Requested",
    request_to_be_friend: "Send friend request",
    blocked: "Blocked",
    private_message: "Private messages",
    not_friend: "Uh... No friends yet.",
    not_online_friend: "None of your friends are online, go call them to play!",
    not_pending_friend_requested: "No pending friend requests",
    not_blocked: "You haven't blocked anyone.",
    request_send_success: "Sent request",
    request_send_error: "Failed to send request",
    placeholder_username: "<Please enter username>#0000",
    friend_request_error: "Friend request failed",
    send_friend_request: "Send a friend request",
    require_username_identify: "Username and tag required to add a friend",
    check_username_identify: "Please check the username and label are spelled correctly",
    emoji_manage: "Manage emoji",
    add_emoji: "Add emoji",
    emoji_manage_description: "Here you can add your favourite server emojis to the emoji bar.",
    emoji_added: "Emoji added",
    emoji_not_added: "Emoji not added",
    drag_modify_emoji_order: "Drag and drop to modify the order of emojis",
    click_preview: "Click to preview",
    preview: "Preview",
    static_emoji: "Static emoji",
    gif_emoji: "GIF emoji",
    guild_not_emoji: "This server does not have any emojis",
    emoji_all_added: "Max emoji reached",
    want_use_emoji: "Want to use emojis?",
    buy_vip_use_emoji: "Buy BUFF to use emojis from servers anywhere!",
    learn_more: "Learn more",
    add_chat_buff: "Add a chat BUFF?",
    per_month_price: "Unlock perks for as little as \xA519.9 per month",
    buy_vip_can_unlock_permission: "BUFF includes a variety of perks, covering text, voice, and many other features, improving your experience.",
    buy_vip: "Buy now",
    renewal: "Renew now",
    gift_friend: "Gift to a friend",
    vip_permission: "BUFF Perks",
    vip_description: "BUFF Description",
    add_buff_make_it_more_interesting: "\u7ED9\u804A\u5929\u52A0\u4E2ABUFF\uFF0C\u8BA9\u5F00\u9ED1\u66F4\u6709\u8DA3\u3002",
    add_buff: "Buy BUFF",
    kaiheila_vip: "Activate Kaiheila BUFF",
    select_friend: "Choose a friend",
    vip_plan: "BUFF Plan",
    payment_mode: "Payment method:",
    payment_price: "Payment amount:",
    yuan: "\u5143",
    bill_record: "Billing record",
    not_found_bill: "\u627E\u4E0D\u5230\u8D26\u5355\uFF1F\u63D0\u4EA4\u5DE5\u5355",
    date: "Date",
    buy_goods: "Buy goods",
    purpose: "Purpose",
    bill_id: "Order no.:",
    payment_time: "Payment time:",
    use_time: "Recharge time:",
    gift_user: "Recipient:",
    bill_wrong: "Order incorrect?",
    kindly_reminder: "Gentle reminder",
    bill_tips: `1. The system will automatically recharge after successful payment, and will automatically recharge within 24 hours if it initially fails. 
2. If the net banking duplicate payment or order is cancelled after payment, and the recharge is not successful, the net banking refund will arrive within 15 working days.`,
    bill_list_none: "No billing records",
    cdkey: "Redemption Code",
    exchange_vip_please_input_cdkey: "Got a gift? Enter the code below:",
    exchange: "Exchange",
    exchange_success: "Redeemed successfully"
  };
  var constants_default = () => {
    const original = Object.assign({}, common_default.constantsCN);
    Object.assign(common_default.constantsCN, overrides);
    return () => Object.assign(common_default.constantsCN, original);
  };

  // src/utils.ts
  function reactFiberWalker(node, prop, goUp = false) {
    if (node.pendingProps?.[prop] !== void 0)
      return node;
    if (goUp)
      return reactFiberWalker(node.return, prop, goUp);
    if (node.child !== null)
      return reactFiberWalker(node.child, prop, goUp);
    if (node.sibling !== null)
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

  // src/en_translate/dom/CLASS_NAMES.json
  var richeditor_placeholders = "richeditor-placeholders";
  var userlist_grouptitle = "user-list-group-title";
  var msg_time = "msg-time";
  var scroll_bottom_tips = "scroll-bottom-tips";
  var message_oneline = "message-oneline";
  var welcome_tip = "welcome-tip";
  var menu_text = "menu-text";
  var guild_invite_modal = "guild-invite-modal";
  var modal_title = "modal-title";
  var share_tips = "share-tips";
  var invite_setting = "invite-setting";
  var button_text = "button-text";
  var search_input = "search-input";
  var edit_invite_url_modal = "edit-invite-url-modal";
  var CLASS_NAMES_default = {
    richeditor_placeholders,
    userlist_grouptitle,
    msg_time,
    scroll_bottom_tips,
    message_oneline,
    welcome_tip,
    menu_text,
    guild_invite_modal,
    modal_title,
    share_tips,
    invite_setting,
    button_text,
    search_input,
    edit_invite_url_modal
  };

  // src/en_translate/dom/chatbarPlaceholders.js
  var chatbarPlaceholders_default = () => {
    const placeholder = document.getElementsByClassName(CLASS_NAMES_default.richeditor_placeholders)[0];
    if (!placeholder?.firstChild.textContent.startsWith("\u7ED9"))
      return;
    placeholder.lastChild.textContent = `Enter to send`;
    placeholder.firstChild.dataset.kaihaxenglish = "";
    const fiber = utils_default.getFiber(placeholder.firstChild);
    const chatInfo = utils_default.reactFiberWalker(fiber, "currentChat", true)?.pendingProps;
    const channelName = chatInfo.currentChannelInfo.name ?? chatInfo.currentChat.target_info?.nickname;
    placeholder.firstChild.textContent = `Send a message to ${channelName}`;
  };

  // src/en_translate/dom/inviteModal.js
  var inviteModal_default = () => {
    const inviteModal = document.getElementsByClassName(CLASS_NAMES_default.guild_invite_modal)[0];
    if (!inviteModal)
      return;
    const inviteModalTitle = inviteModal.getElementsByClassName(CLASS_NAMES_default.modal_title)[0];
    if (utils_default.startsNotAscii(inviteModalTitle.firstChild.textContent)) {
      const guildInfo = utils_default.reactFiberWalker(utils_default.getFiber(inviteModal), "guildInfo", true)?.pendingProps.guildInfo;
      inviteModalTitle.firstChild.textContent = `Invite users to join ${guildInfo.name}`;
    }
    inviteModal.getElementsByClassName(CLASS_NAMES_default.share_tips)[0].innerText = "Share this link, your friends can click to join";
    const inviteSetting = inviteModal.getElementsByClassName(CLASS_NAMES_default.invite_setting)[0];
    if (inviteSetting.firstChild.childNodes.length === 1) {
      inviteSetting.firstChild.textContent = "Your invite link will never expire. ";
    } else {
      const duration = inviteSetting.firstChild.childNodes[1];
      duration.textContent = duration.textContent.replaceAll("\u5929", " days").replaceAll("\u5206\u949F", " minutes").replaceAll("1\u4E2A\u5C0F\u65F6", "1 hour").replaceAll("\u4E2A\u5C0F\u65F6", " hours");
      inviteSetting.firstChild.firstChild.textContent = "Your invite link will expire after ";
      inviteSetting.firstChild.lastChild.textContent = ".";
    }
    inviteSetting.lastChild.innerText = " Edit invite link";
  };

  // src/en_translate/dom/memberListGroup.js
  var memberListGroup_default = () => {
    const titles = Array.from(document.getElementsByClassName(CLASS_NAMES_default.userlist_grouptitle));
    const online = titles.find((t) => t.innerText.startsWith("\u5728\u7EBF"));
    if (online)
      online.innerText = `Online ${online.innerText.split(" ")[1]}`;
    const offline = titles.find((t) => t.innerText.startsWith("\u79BB\u7EBF"));
    if (offline)
      offline.innerText = `Offline ${offline.innerText.split(" ")[1]}`;
  };

  // src/en_translate/dom/MENU_TEXTS.json
  var \u670D\u52A1\u5668\u52A9\u529B = "Server Boost";
  var \u9080\u8BF7\u5176\u4ED6\u4EBA = "Invite People";
  var \u670D\u52A1\u5668\u8BBE\u7F6E = "Server Settings";
  var \u521B\u5EFA\u65B0\u9891\u9053 = "Create Channel";
  var \u521B\u5EFA\u65B0\u5206\u7EC4 = "Create Group";
  var \u901A\u77E5\u8BBE\u5B9A = "Notification Settings";
  var \u9690\u79C1\u8BBE\u7F6E = "Privacy Settings";
  var \u4FEE\u6539\u672C\u670D\u52A1\u5668\u6635\u79F0 = "Change Nickname";
  var \u9690\u85CF\u514D\u6253\u6270\u9891\u9053 = "Hide Muted";
  var MENU_TEXTS_default = {
    \u670D\u52A1\u5668\u52A9\u529B,
    \u9080\u8BF7\u5176\u4ED6\u4EBA,
    \u670D\u52A1\u5668\u8BBE\u7F6E,
    \u521B\u5EFA\u65B0\u9891\u9053,
    \u521B\u5EFA\u65B0\u5206\u7EC4,
    \u901A\u77E5\u8BBE\u5B9A,
    \u9690\u79C1\u8BBE\u7F6E,
    \u4FEE\u6539\u672C\u670D\u52A1\u5668\u6635\u79F0,
    \u9690\u85CF\u514D\u6253\u6270\u9891\u9053
  };

  // src/en_translate/dom/menuText.js
  var menuText_default = () => {
    const menuItems = document.getElementsByClassName(CLASS_NAMES_default.menu_text);
    for (const menuItem of menuItems)
      if (menuItem.firstElementChild)
        menuItem.firstElementChild.innerText = MENU_TEXTS_default[menuItem.firstElementChild.innerText] ?? menuItem.firstElementChild.innerText;
      else
        menuItem.innerText = MENU_TEXTS_default[menuItem.innerText] ?? menuItem.innerText;
  };

  // src/en_translate/dom/messageTime.js
  var messageTime_default = () => {
    const messageTimes = document.getElementsByClassName(CLASS_NAMES_default.msg_time);
    for (const elem of messageTimes) {
      if (elem.innerText.startsWith("\u4ECA\u5929 \u51CC\u6668"))
        elem.innerText = `Early this morning at ${elem.innerText.split(" ").slice(2)}`;
      else if (utils_default.startsNotAscii(elem.innerText)) {
        const replaced = elem.innerText.replaceAll("\u4E0A\u5348", "morning").replaceAll("\u4E0B\u5348", "afternoon").replaceAll("\u4ECA\u5929", "This").replaceAll("\u6628\u5929", "Yesterday");
        elem.innerText = replaced.split(" ").slice(0, -1).join(" ") + " at " + _.last(replaced.split(" "));
      }
    }
  };

  // src/en_translate/dom/nowFriends.js
  var nowFriends_default = () => {
    const elem = document.getElementsByClassName(CLASS_NAMES_default.message_oneline)[0];
    if (!elem || !elem.lastChild.innerText.startsWith("\u4F60\u4E0E"))
      return;
    const friendName = utils_default.reactFiberWalker(utils_default.getFiber(elem), "currentChat", true)?.pendingProps.currentChat.target_info.nickname;
    elem.lastChild.innerText = `You and ${friendName} are now friends.`;
  };

  // src/en_translate/dom/scrollToBottom.js
  var scrollToBottom_default = () => {
    const bar = document.getElementsByClassName(CLASS_NAMES_default.scroll_bottom_tips)[0];
    if (!bar)
      return;
    bar.firstChild.innerText = "You're viewing old messages";
    bar.lastChild.innerText = "Jump to present";
  };

  // src/en_translate/dom/searchInput.js
  var searchInput_default = () => {
    const elems = document.getElementsByClassName(CLASS_NAMES_default.search_input);
    for (const elem of elems)
      if (elem.firstChild.placeholder === "\u641C\u7D22")
        elem.firstChild.placeholder = "Search";
  };

  // src/en_translate/dom/TOOLTIPS.json
  var \u9891\u9053\u514D\u6253\u6270 = "Mute Channel";
  var \u53D6\u6D88\u9891\u9053\u514D\u6253\u6270 = "Unmute Channel";
  var \u7F6E\u9876 = "Pins";
  var \u7528\u6237\u5217\u8868 = "Member List";
  var \u641C\u7D22 = "Search";
  var \u7528\u6237\u8BBE\u7F6E = "User Settings";
  var \u670D\u52A1\u5668\u521B\u5EFA\u8005 = "Server Owner";
  var \u4E0A\u4F20 = "Upload";
  var \u5C55\u5F00\u8F93\u5165\u680F = "Expand Chatbar";
  var \u8BED\u97F3\u8F93\u5165\u6A21\u5F0F = "Voice Mode";
  var \u8BED\u97F3\u8BBE\u7F6E = "Voice Settings";
  var \u8868\u60C5 = "Emojis";
  var \u6DFB\u52A0\u56DE\u5E94 = "Add Response";
  var \u7F16\u8F91\u6D88\u606F = "Edit";
  var \u56DE\u590D = "Reply";
  var \u66F4\u591A = "More";
  var \u89E3\u9501\u6A2A\u5E45 = "Unlock banners";
  var \u521B\u5EFA\u65B0\u9891\u90532 = "New Channel";
  var \u518D\u6B21\u70B9\u51FB\u8FDB\u5165\u9891\u9053 = "Double click to join";
  var \u521B\u5EFA\u9080\u8BF7 = "Invite people";
  var \u7F16\u8F91\u9891\u9053 = "Edit Channel";
  var \u6DFB\u52A0\u670D\u52A1\u5668 = "Add Server";
  var \u53D1\u73B0\u670D\u52A1\u5668 = "Explore Servers";
  var \u4E0B\u8F7D\u5BA2\u6237\u7AEF = "Download Apps";
  var \u6211\u7684\u4E3B\u9875 = "Home";
  var \u666E\u901A\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969490\u5929_br___BUFF\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969410\u5929 = "Name change allowed every 90 days<br />BUFF users can change name every 10 days";
  var REGEX_\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7B49\u7EA7\u8FD8\u9700__d__\u4E2A\u52A9\u529B\u5305 = "Next level in $1 boosts";
  var \u590D\u5236\u7528\u6237\u540D = "Copy Username";
  var \u590D\u5236\u6210\u529F = "Copied!";
  var \u5B98\u65B9\u8BA4\u8BC1 = "Verified";
  var \u5408\u4F5C\u4F19\u4F34 = "Partnered";
  var TOOLTIPS_default = {
    \u9891\u9053\u514D\u6253\u6270,
    \u53D6\u6D88\u9891\u9053\u514D\u6253\u6270,
    \u7F6E\u9876,
    \u7528\u6237\u5217\u8868,
    \u641C\u7D22,
    \u7528\u6237\u8BBE\u7F6E,
    \u670D\u52A1\u5668\u521B\u5EFA\u8005,
    \u4E0A\u4F20,
    \u5C55\u5F00\u8F93\u5165\u680F,
    \u8BED\u97F3\u8F93\u5165\u6A21\u5F0F,
    \u8BED\u97F3\u8BBE\u7F6E,
    \u8868\u60C5,
    \u6DFB\u52A0\u56DE\u5E94,
    \u7F16\u8F91\u6D88\u606F,
    \u56DE\u590D,
    \u66F4\u591A,
    \u89E3\u9501\u6A2A\u5E45,
    \u521B\u5EFA\u65B0\u9891\u9053: \u521B\u5EFA\u65B0\u9891\u90532,
    \u518D\u6B21\u70B9\u51FB\u8FDB\u5165\u9891\u9053,
    \u521B\u5EFA\u9080\u8BF7,
    \u7F16\u8F91\u9891\u9053,
    \u6DFB\u52A0\u670D\u52A1\u5668,
    \u53D1\u73B0\u670D\u52A1\u5668,
    \u4E0B\u8F7D\u5BA2\u6237\u7AEF,
    \u6211\u7684\u4E3B\u9875,
    "\u666E\u901A\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969490\u5929<br />BUFF\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969410\u5929": \u666E\u901A\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969490\u5929_br___BUFF\u7528\u6237\u6BCF\u6B21\u4FEE\u6539\u7528\u6237\u540D\u9700\u95F4\u969410\u5929,
    "REGEX_\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7B49\u7EA7\u8FD8\u9700(\\d+)\u4E2A\u52A9\u529B\u5305": REGEX_\u8DDD\u79BB\u4E0B\u4E00\u4E2A\u7B49\u7EA7\u8FD8\u9700__d__\u4E2A\u52A9\u529B\u5305,
    \u590D\u5236\u7528\u6237\u540D,
    \u590D\u5236\u6210\u529F,
    \u5B98\u65B9\u8BA4\u8BC1,
    \u5408\u4F5C\u4F19\u4F34
  };

  // src/en_translate/dom/tooltips.js
  var simpleTooltips = {};
  var regexTooltips = [];
  for (const key in TOOLTIPS_default) {
    const replacement = TOOLTIPS_default[key];
    if (key.startsWith("REGEX_"))
      regexTooltips.push([new RegExp(key.substr(6), "g"), replacement]);
    else
      simpleTooltips[key] = replacement;
  }
  var matchTooltip = (tip) => {
    if (simpleTooltips[tip])
      return simpleTooltips[tip];
    for (const [match, replacement] of regexTooltips)
      if (tip.match(match)?.[0] === tip)
        return tip.replaceAll(match, replacement);
  };
  var tooltips_default = () => {
    const elems = document.querySelectorAll("[data-tip]");
    for (const elem of elems)
      elem.dataset.tip = matchTooltip(elem.dataset.tip) ?? elem.dataset.tip;
  };

  // src/en_translate/dom/welcomeTips.js
  var welcomeTips_default = () => {
    const tip = document.getElementsByClassName(CLASS_NAMES_default.welcome_tip)[0];
    if (!tip || !utils_default.startsNotAscii(tip.innerText))
      return;
    if (tip.innerText.startsWith("\u8FD9\u91CC\u662F\u4F60\u4E0E")) {
      const userName = utils_default.reactFiberWalker(utils_default.getFiber(tip), "currentChat", true)?.pendingProps.currentChat.target_info.nickname;
      tip.innerText = `This is the beginning of your PMs with @${userName}.`;
    } else if (tip.innerText.startsWith("\u6B22\u8FCE\u6765\u5230")) {
      tip.firstChild.textContent = "This is the beginning of #";
      tip.removeChild(tip.childNodes[2]);
      tip.childNodes[2].textContent = ". ";
      tip.lastChild.innerText = "You are witnessing history.";
    }
  };

  // src/en_translate/dom/index.js
  var translateElements = () => {
    chatbarPlaceholders_default();
    memberListGroup_default();
    messageTime_default();
    scrollToBottom_default();
    nowFriends_default();
    welcomeTips_default();
    tooltips_default();
    menuText_default();
    inviteModal_default();
    searchInput_default();
  };
  var dom_default = () => {
    const interval = setInterval(translateElements, 500);
    return () => clearInterval(interval);
  };

  // src/en_translate/index.ts
  var en_translate_default = () => {
    const patches = [constants_default(), dom_default()];
    return () => _.forEachRight(patches, (p) => p());
  };

  // src/index.ts
  if (window.kaihax) {
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