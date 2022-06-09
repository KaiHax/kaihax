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
    const changedChildren = /* @__PURE__ */ new Set();
    for (const record of records) {
      changedElems.add(record.target);
      for (const e of record.addedNodes)
        changedChildren.add(e);
      for (const e of record.removedNodes)
        changedChildren.add(e);
    }
    for (const elem of changedElems)
      for (const [sel, cb] of observations)
        if (elem.matches(sel))
          cb(elem);
  });
  observer.observe(document.getElementById("root"), {
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
  var richeditor_placeholders = "editor-placeholder";
  var userlist_container = "user-list-container";
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
    userlist_container,
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

  // src/en_translate/dom/chatbarPlaceholders.ts
  var chatbarPlaceholders_default = () => patcher_default.observe(`.${CLASS_NAMES_default.richeditor_placeholders}`, (elem) => {
    if (!elem.textContent?.startsWith("\u7ED9"))
      return;
    const fiber = utils_default.getFiber(elem);
    const chatInfo = utils_default.reactFiberWalker(fiber, "currentChat", true)?.pendingProps;
    const channelName = chatInfo.currentChannelInfo.name ?? chatInfo.currentChat.target_info?.nickname;
    elem.innerHTML = `Send a message to ${channelName}`;
  });

  // src/en_translate/dom/memberListGroup.ts
  var memberListGroup_default = () => patcher_default.observe(`.${CLASS_NAMES_default.userlist_container}`, (elem) => {
    for (const title of elem.getElementsByClassName(CLASS_NAMES_default.userlist_grouptitle))
      if (title.textContent?.startsWith("\u5728\u7EBF"))
        title.innerHTML = `Online ${title.textContent.split(" ")[1]}`;
      else if (title.textContent?.startsWith("\u79BB\u7EBF"))
        title.innerHTML = `Offline ${title.textContent.split(" ")[1]}`;
  });

  // src/en_translate/dom/messageTime.ts
  var messageTime_default = () => patcher_default.observe(`.${CLASS_NAMES_default.msg_time}`, (elem) => {
    if (elem.textContent?.startsWith("\u4ECA\u5929 \u51CC\u6668"))
      elem.innerHTML = `Early this morning at ${elem.textContent.split(" ").slice(2)}`;
    else if (elem.textContent && utils_default.startsNotAscii(elem.textContent)) {
      const replaced = elem.textContent.replaceAll("\u4E0A\u5348", "morning").replaceAll("\u4E0B\u5348", "afternoon").replaceAll("\u4ECA\u5929", "This").replaceAll("\u6628\u5929", "Yesterday");
      const part1 = replaced.split(" ").slice(0, -1).join(" ");
      const part2 = _.last(replaced.split(" "));
      elem.innerHTML = `${part1} at ${part2}`;
    }
  });

  // src/en_translate/dom/index.ts
  var dom_default = () => {
    const unpatches = [
      chatbarPlaceholders_default(),
      memberListGroup_default(),
      messageTime_default()
    ];
    return () => unpatches.forEach((p) => p());
  };

  // src/en_translate/index.ts
  var en_translate_default = () => {
    const patches = [constants_default(), dom_default()];
    return () => _.forEachRight(patches, (p) => p());
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