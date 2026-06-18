# PixxaOwenStereo

A BetterDiscord plugin that forces stereo voice transport and a high Opus bitrate for Discord voice connections.

## Features

- Forces stereo (2-channel) voice encoding
- Sets voice bitrate to 512 kbps
- Configures Opus encoder parameters
- Disables Forward Error Correction (FEC)
- Warns if Discord voice processing features may interfere with audio quality

## Requirements

- BetterDiscord
- Latest Discord Desktop

## Installation

1. Download `PixxaOwenStereo.plugin.js`
2. Place it inside:

```
BetterDiscord/plugins
```

3. Enable the plugin from BetterDiscord.

## Recommended Discord Settings

For best results disable:

- Echo Cancellation
- Noise Suppression
- Noise Cancellation (if available)

The plugin will display a warning if these are enabled.

## How it works

The plugin patches Discord voice connection creation and transport configuration to enforce stereo Opus parameters before the transport options are applied.

Main changes include:

- Stereo encoding
- 512 kbps bitrate
- 48 kHz sample rate
- Disabled FEC
- Opus stereo SDP parameters

## Compatibility

Tested with current BetterDiscord builds.

Future Discord updates may require plugin updates.

## Disclaimer

This plugin relies on Discord's internal implementation and may stop working after Discord updates.

## License

MIT License
