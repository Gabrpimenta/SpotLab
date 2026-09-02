# Third-party assets

SpotLab bundles its runtime media locally. The application does not download interface art or audio from third-party hosts.

## Figma Community poker assets

Source: [20k+ Casino and poker assets for gambline game design (Community)](https://www.figma.com/design/aoPSfh2u5j8d7LSYyrCeDB/20k--Casino-and-poker-assets-for-gambline-game-design--Community-?node-id=0-1&p=f&m=dev)

License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)

Figma documents free Community design files as CC BY 4.0. The source metadata available during integration did not expose a creator display name, so this attribution identifies and links the original resource directly.

| Local file                                 | Figma node | Source layer | Usage                                  |
| ------------------------------------------ | ---------- | ------------ | -------------------------------------- |
| `assets/figma-community/sparkle-field.png` | `2:529`    | `vfx_007`    | Low-opacity League background detail   |
| `assets/figma-community/spade-trophy.png`  | `2:682`    | `pic_trophy` | Daily challenge and achievement accent |

The files are unmodified raster exports used inside original SpotLab layouts. Branded currency, localized banners, third-party logos, baked-in copy, and sprite sheets are not included.

## Kenney UI Audio

Source: [Kenney UI Audio](https://kenney.nl/assets/ui-audio)

License: CC0 1.0 Universal. A copy of the license is stored at `assets/audio/KENNEY-UI-AUDIO-LICENSE.txt`.

| Local file                    | Usage                        |
| ----------------------------- | ---------------------------- |
| `assets/audio/ui-tap.wav`     | Selection feedback           |
| `assets/audio/ui-success.wav` | Successful decision feedback |
| `assets/audio/ui-alert.wav`   | Review and error feedback    |

## Open-source libraries

Runtime library licenses are recorded in `package-lock.json` and their upstream packages. Notable visual and interaction dependencies include Expo, React Native, React Native Reanimated, React Native SVG, and Lucide React Native.
