/**
 * @name PixxaOwenStereo
 * @author pixxaowens
 * @version 1.0.0
 * @description Forces stereo voice transport and high bitrate.
 */

const BITRATE = 512000;
const NAME = "PixxaOwenStereo";

module.exports = class PixxaOwenStereo {
    constructor() {
        this.notice = null;
        this.connections = new WeakSet();
    }

    start() {
        this.stop();
        this.connections = new WeakSet();
        this.warnVoiceProcessing();
        this.patchConnectionFactories();
        this.patchVoiceControllers();
    }

    stop() {
        try {
            BdApi.Patcher.unpatchAll(NAME);
        }
        catch (_) {}

        if (typeof this.notice === "function") {
            try {
                this.notice(true);
            }
            catch (_) {}
        }

        this.notice = null;
        this.connections = new WeakSet();
    }

    warnVoiceProcessing() {
        const store = this.getModule((module) => {
            return module
                && typeof module.getEchoCancellation === "function"
                && typeof module.getNoiseSuppression === "function";
        });

        if (!store) {
            return;
        }

        const enabled = [];

        if (this.readStoreFlag(store, "getEchoCancellation")) {
            enabled.push("Echo Cancellation");
        }

        if (this.readStoreFlag(store, "getNoiseSuppression")) {
            enabled.push("Noise Suppression");
        }

        if (typeof store.getNoiseCancellation === "function" && this.readStoreFlag(store, "getNoiseCancellation")) {
            enabled.push("Noise Cancellation");
        }

        if (!enabled.length) {
            return;
        }

        const message = `Disable ${this.formatList(enabled)} for ${NAME}.`;

        if (BdApi.UI && typeof BdApi.UI.showNotice === "function") {
            this.notice = BdApi.UI.showNotice(message, {type: "warning", timeout: 0});
            return;
        }

        if (BdApi.UI && typeof BdApi.UI.showToast === "function") {
            BdApi.UI.showToast(message, {type: "warning", timeout: 5000});
        }
    }

    patchConnectionFactories() {
        for (const module of this.getAllByKeys("createVoiceConnectionWithOptions", "createOwnStreamConnectionWithOptions")) {
            this.patchFactory(module, "createVoiceConnectionWithOptions");
            this.patchFactory(module, "createOwnStreamConnectionWithOptions");
        }
    }

    patchFactory(module, key) {
        if (!module || typeof module[key] !== "function") {
            return;
        }

        try {
            BdApi.Patcher.after(NAME, module, key, (_, __, connection) => {
                this.patchConnection(connection);
                return connection;
            });
        }
        catch (_) {}
    }

    patchVoiceControllers() {
        const seen = new Set();

        for (const module of this.getAllByPrototypeKeys("updateVideoQuality")) {
            const proto = module && module.prototype;

            if (!proto || seen.has(proto) || typeof proto.updateVideoQuality !== "function") {
                continue;
            }

            seen.add(proto);

            try {
                BdApi.Patcher.after(NAME, proto, "updateVideoQuality", (instance) => {
                    this.patchConnection(instance && instance.conn);
                });
            }
            catch (_) {}
        }
    }

    patchConnection(connection) {
        if (!connection || typeof connection.setTransportOptions !== "function" || this.connections.has(connection)) {
            return;
        }

        this.connections.add(connection);

        try {
            BdApi.Patcher.before(NAME, connection, "setTransportOptions", (_, args) => {
                if (!Array.isArray(args) || !args.length) {
                    return;
                }

                args[0] = this.applyStereo(args[0]);
            });
        }
        catch (_) {}
    }

    applyStereo(options) {
        if (!options || typeof options !== "object") {
            return options;
        }

        this.applyStereoToTarget(options);

        const nestedTransport = options.audio && options.audio.transportOptions;
        if (nestedTransport && typeof nestedTransport === "object") {
            this.applyStereoToTarget(nestedTransport);
        }

        return options;
    }

    applyStereoToTarget(target) {
        if (!target || typeof target !== "object") {
            return;
        }

        if ("encodingVoiceBitRate" in target || target.audioEncoder || target.encodingParams) {
            target.encodingVoiceBitRate = BITRATE;
        }

        if ("fec" in target || target.audioEncoder) {
            target.fec = false;
        }

        if (target.encodingParams && typeof target.encodingParams === "object") {
            target.encodingParams.channels = 2;
            target.encodingParams.stereo = 1;
            target.encodingParams["sprop-stereo"] = 1;
        }

        if (!target.audioEncoder || typeof target.audioEncoder !== "object") {
            return;
        }

        const encoder = target.audioEncoder;

        encoder.channels = 2;
        encoder.rate = BITRATE;
        encoder.freq = 48000;
        encoder.pacsize = 20;

        if ("fec" in encoder) {
            encoder.fec = false;
        }

        if (!encoder.params || typeof encoder.params !== "object") {
            encoder.params = {};
        }

        encoder.params.channels = 2;
        encoder.params.stereo = 1;
        encoder.params["sprop-stereo"] = 1;
        encoder.params.useinbandfec = 0;
        encoder.params.maxplaybackrate = 48000;
    }

    readStoreFlag(store, key) {
        try {
            return Boolean(store[key]());
        }
        catch (_) {
            return false;
        }
    }

    formatList(items) {
        if (items.length <= 1) {
            return items[0];
        }

        if (items.length === 2) {
            return `${items[0]} and ${items[1]}`;
        }

        return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
    }

    getModule(filter) {
        try {
            return BdApi.Webpack.getModule(filter);
        }
        catch (_) {
            return null;
        }
    }

    getAllByKeys(...keys) {
        try {
            const modules = BdApi.Webpack.getAllByKeys(...keys);
            return Array.isArray(modules) ? modules : [];
        }
        catch (_) {
            return [];
        }
    }

    getAllByPrototypeKeys(...keys) {
        try {
            const modules = BdApi.Webpack.getAllByPrototypeKeys(...keys);
            return Array.isArray(modules) ? modules : [];
        }
        catch (_) {
            return [];
        }
    }
};
