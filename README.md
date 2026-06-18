# Stereo

> A BetterDiscord plugin that forces stereo voice transport and high-quality Opus encoding for Discord voice connections.

## Features

- Stereo (2-channel) voice encoding
- 512 kbps voice bitrate
- 48 kHz sample rate
- Automatic voice connection patching
- Disables Forward Error Correction (FEC)
- Warns when Discord voice processing may affect audio quality
- No configuration required

---

## Installation

1. Download the latest `PixxaOwenStereo.plugin.js`.
2. Move the file to your BetterDiscord plugins folder.

Default Windows location:

```text
%AppData%\BetterDiscord\plugins
```

3. Open Discord.
4. Go to **Settings → BetterDiscord → Plugins**.
5. Enable **PixxaOwenStereo**.

---

## Recommended Discord Settings

For the best audio quality, disable the following Discord voice processing options:

- Echo Cancellation
- Noise Suppression
- Noise Cancellation (if available)

Stereo will automatically notify you if any of these settings are enabled.

---

## What does this plugin do?

Stereo patches Discord's internal voice transport before a voice connection is established and applies optimized Opus encoder settings, including:

| Setting | Value |
|---------|------:|
| Channels | 2 |
| Bitrate | 512000 bps |
| Sample Rate | 48000 Hz |
| Stereo | Enabled |
| sprop-stereo | Enabled |
| Forward Error Correction | Disabled |

These changes are applied automatically every time a voice connection is created.

---

## Compatibility

- BetterDiscord
- Discord Desktop
- Windows
- Linux
- macOS

Because Discord frequently changes its internal implementation, future updates may temporarily break compatibility until the plugin is updated.

---

## Limitations

This plugin only modifies the client-side voice transport configuration.

Final audio quality still depends on factors such as:

- Discord server limitations
- Voice channel settings
- Network quality
- Microphone quality
- Discord backend behavior

---

## Disclaimer

Stereo is an unofficial BetterDiscord plugin.

This project is **not affiliated with, endorsed by, or supported by Discord Inc. or BetterDiscord**.

Use at your own risk.

---

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more information.

---

## Author

**iblamepixxa**

GitHub: https://github.com/iblamepixxa

Repository: https://github.com/iblamepixxa/stereo

---

## Contributing

Issues, suggestions, and pull requests are welcome.

If you encounter a bug after a Discord update, please open an issue with as much information as possible.
