# Field Types: Media, Date, Computed and Relational

The Image, File, DateTime, Relation, Compute, UUID and Map field types. Media field storage itself is covered in `media.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Image Field

The Image field type allows users to upload and manage images within the CMS. It’s basically an alias of the [File](https://sveltiacms.app/en/docs/fields/file) field type but limited to image files.

The `widget` property for this field type is `image`.

See the [File field documentation](https://sveltiacms.app/en/docs/fields/file) for details on the UI, data type, and available options.

### Examples

#### Standard Image Field

This example shows a basic Image field.

```yaml [YAML]
- name: image
  label: Image
  widget: image
```

```toml [TOML]
[[fields]]
name = "image"
label = "Image"
widget = "image"
```

```json [JSON]
{
  "name": "image",
  "label": "Image",
  "widget": "image"
}
```

```js [JavaScript]
{
  name: 'image',
  label: 'Image',
  widget: 'image',
}
```

Output example:

```yaml [YAML]
image: /uploads/photo.jpg
```

```toml [TOML]
image = "/uploads/photo.jpg"
```

```json [JSON]
{
  "image": "/uploads/photo.jpg"
}
```

#### Image Field with Alt Text

To include additional metadata such as alt text for accessibility, you can use an [object field](https://sveltiacms.app/en/docs/fields/object) to group the image source and alt text together.

```yaml [YAML]
- name: image
  widget: object
  fields:
    - { name: src, widget: image }
    - { name: alt, widget: string }
```

```toml [TOML]
[[fields]]
name = "image"
widget = "object"
[[fields.fields]]
name = "src"
widget = "image"
[[fields.fields]]
name = "alt"
widget = "string"
```

```json [JSON]
{
  "name": "image",
  "widget": "object",
  "fields": [
    { "name": "src", "widget": "image" },
    { "name": "alt", "widget": "string" }
  ]
}
```

```js [JavaScript]
{
  name: 'image',
  widget: 'object',
  fields: [
    { name: 'src', widget: 'image' },
    { name: 'alt', widget: 'string' },
  ],
}
```

Output example:

```yaml [YAML]
image:
  src: /uploads/photo.jpg
  alt: A beautiful sunset
```

```toml [TOML]
[image]
src = "/uploads/photo.jpg"
alt = "A beautiful sunset"
```

```json [JSON]
{
  "image": {
    "src": "/uploads/photo.jpg",
    "alt": "A beautiful sunset"
  }
}
```

In the future, we may add built-in support for alt text and other metadata directly within the Image field type.

#### Multiple Image Uploads with Restrictions

This example shows how to allow multiple image uploads using the `multiple` option, along with minimum and maximum limits and file type restrictions.

```yaml [YAML]
- name: gallery
  label: Gallery
  widget: image
  multiple: true
  min: 2
  max: 5
  accept: image/webp
```

```toml [TOML]
[[fields]]
name = "gallery"
label = "Gallery"
widget = "image"
multiple = true
min = 2
max = 5
accept = "image/webp"
```

```json [JSON]
{
  "name": "gallery",
  "label": "Gallery",
  "widget": "image",
  "multiple": true,
  "min": 2,
  "max": 5,
  "accept": "image/webp"
}
```

```js [JavaScript]
{
  name: 'gallery',
  label: 'Gallery',
  widget: 'image',
  multiple: true,
  min: 2,
  max: 5,
  accept: 'image/webp',
}
```

Output example:

```yaml [YAML]
gallery:
  - /uploads/photo1.webp
  - /uploads/photo2.webp
  - /uploads/photo3.webp
```

```toml [TOML]
gallery = ["/uploads/photo1.webp", "/uploads/photo2.webp", "/uploads/photo3.webp"]
```

```json [JSON]
{
  "gallery": ["/uploads/photo1.webp", "/uploads/photo2.webp", "/uploads/photo3.webp"]
}
```

Source: https://sveltiacms.app/en/docs/fields/image

---

## File Field

The File field type allows users to upload and manage files within the CMS.

**Alternative for images**

If you need to limit uploads to images only, consider using the [Image](https://sveltiacms.app/en/docs/fields/image) field type instead.

### User Interface

#### Editor

A large upload button is displayed for the File field. When it’s is clicked, a file selection dialog with the following features appears:

- Tabs to select files from different sources: field assets, entry assets, file assets, collection assets, and global assets (if the [internal media storage](https://sveltiacms.app/en/docs/media/internal) is enabled).
- An option to upload new files by dragging and dropping them into the dialog or by selecting them from the file system.
- An option to enter a URL to select a file from an external source (if `choose_url` option is enabled).
- Integration with [external media storage providers](https://sveltiacms.app/en/docs/media#external-storage) if configured.
- Integration with [stock photo providers](https://sveltiacms.app/en/docs/integrations/stock-photos) for easy selection of free images (for Image fields only).
- File type filtering based on the `accept` option.
- A search bar to quickly find existing assets.

If the `multiple` option is enabled, users can select multiple files at once. Uploaded files are displayed as a list with options to remove or replace each file.

Files in a multiple File or Image field can be reordered using the drag handle to the left of each one. With the handle focused, the Up and Down arrow keys move a file one position, while Home and End send it to the start or end of the list. On a touch screen, Move Up and Move Down buttons are shown in place of the handle, because drag and drop requires a mouse.

Users can paste an image from the clipboard directly into a File or Image field by clicking the Paste button or using the keyboard shortcut (Ctrl+V or Cmd+V). This works on both desktop and mobile devices.

On desktop, users can drag and drop file(s) directly onto the field to attach them without opening the file selection dialog.

Unsaved files can be renamed.

The CMS prevents the same file from being uploaded twice. It compares the hashes and selects an existing asset instead.

#### Preview

A list of uploaded file names with links to access each file. For images, a thumbnail preview is shown.

**CSP**

If your site uses a Content Security Policy (CSP), You may need to update it to display external images properly. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Data Type

A string representing the URL or path to a file. If `multiple` option is enabled, it will be an array of strings.

If the `required` option is set to `false` and the field is left empty, the value will be an empty string or an empty array, depending on whether `multiple` is enabled.

By default, Sveltia CMS does not slugify uploaded filenames. If your site generator expects hyphenated filenames, you can enable the `slugify_filename` [internal media storage option](https://sveltiacms.app/en/docs/media#configuration).

### Data Validation

- If the `required` option is set to `true`, at least one file must be selected.
- If the `multiple` option is enabled, the number of selected files must be between the `min` and `max` limits, if specified.
- The selected file(s) must match the allowed file types specified in the `accept` option, if provided.
- If the `pattern` option is provided, the file URL(s) must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the File field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `file`.

#### Optional Options

**Breaking change from Netlify/Decap CMS**

Sveltia CMS does not support the `allow_multiple` option. It’s a confusing option that defaults to `true`, and there is a separate option called `media_library.config.multiple`. We have added the new `multiple` option instead, which is more intuitive and works with all media storage providers.

##### `default`

- **Type**: `string` or `array of strings`
- **Default**: `''` or `[]`

The default value for the field. Should be a string for single file upload or an array of strings for multiple file uploads.

##### `multiple`

- **Type**: `boolean`
- **Default**: `false`

Whether to allow uploading or selecting multiple files.

##### `min`

- **Type**: `integer`
- **Default**: `0`

The minimum number of files required. This enables validation to ensure that users upload or select at least this many files. Ignored if `multiple` is set to `false`.

##### `max`

- **Type**: `integer`
- **Default**: `Infinity`

The maximum number of files allowed. This enables validation to prevent users from uploading or selecting more than this many files. Ignored if `multiple` is set to `false`.

##### `choose_url`

- **Type**: `boolean`
- **Default**: `true`

Whether to show the option to choose a file by URL instead of uploading/selecting from the media storage.

##### `accept`

- **Type**: `string`
- **Default**: `undefined`

A comma-separated list of allowed file types ([MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types) or file extensions) for upload. For example, to allow only PDF files, set this option to `application/pdf` or `.pdf`. To allow only image files, set it to `image/*`. If not specified, all file types are allowed. See the [`accept` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept) documentation on MDN for more details.

Image field only accepts AVIF, GIF, JPEG, PNG, WebP or SVG images by default. Other image formats like BMP, HEIC, JPEG XL, PSD, TIFF are excluded. File field has no default restriction.

##### `media_library`

##### `media_libraries`

##### `media_folder`

##### `public_folder`

### Examples

#### Basic File Field

This example demonstrates a basic File field that allows users to upload or select a single file.

```yaml [YAML]
- name: document
  label: Document
  widget: file
```

```toml [TOML]
[[fields]]
name = "document"
label = "Document"
widget = "file"
```

```json [JSON]
{
  "fields": [
    {
      "name": "document",
      "label": "Document",
      "widget": "file"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'document',
      label: 'Document',
      widget: 'file',
    },
  ];
}
```

Output example:

```yaml [YAML]
document: /uploads/sample.pdf
```

```toml [TOML]
document = "/uploads/sample.pdf"
```

```json [JSON]
{
  "document": "/uploads/sample.pdf"
}
```

#### Multiple File Uploads with Restrictions

This example shows a File field configured to allow multiple file uploads with minimum and maximum limits.

```yaml [YAML]
- name: flyers
  label: Flyers
  widget: file
  multiple: true
  min: 1
  max: 5
  accept: application/pdf,.pdf
```

```toml [TOML]
[[fields]]
name = "flyers"
label = "Flyers"
widget = "file"
multiple = true
min = 1
max = 5
accept = "application/pdf,.pdf"
```

```json [JSON]
{
  "fields": [
    {
      "name": "flyers",
      "label": "Flyers",
      "widget": "file",
      "multiple": true,
      "min": 1,
      "max": 5,
      "accept": "application/pdf,.pdf"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'flyers',
      label: 'Flyers',
      widget: 'file',
      multiple: true,
      min: 1,
      max: 5,
      accept: 'application/pdf,.pdf',
    },
  ];
}
```

Output example:

```yaml [YAML]
flyers:
  - /uploads/flyer1.pdf
  - /uploads/flyer2.pdf
```

```toml [TOML]
flyers = ["/uploads/flyer1.pdf", "/uploads/flyer2.pdf"]
```

```json [JSON]
{
  "flyers": ["/uploads/flyer1.pdf", "/uploads/flyer2.pdf"]
}
```

Source: https://sveltiacms.app/en/docs/fields/file

---

## DateTime Field

The DateTime field type allows users to select and input dates and times using a date/time picker interface.

### User Interface

#### Editor

The browser’s native date/time picker. Depending on the configuration, it can handle date-only, time-only, or both date and time inputs.

**Future Plans**

We plan to enhance the UI with a custom date/time picker in the future.

#### Preview

A string representation of the date and/or time, formatted according to the specified `format`, `date_format`, or `time_format` options, or in ISO 8601 format by default.

### Data Type

A string representing the date and/or time in ISO 8601 format by default, or in a custom format if specified. The possible formats are:

- Date-only: `YYYY-MM-DD` (e.g., `2025-08-15`)
- Time-only:
  - With `picker_utc`: `HH:mm:ssZ` (e.g., `14:30:00Z`).
  - Without `picker_utc`: `HH:mm:ss` (e.g., `14:30:00`).
- Date and time:
  - With `picker_utc`: `YYYY-MM-DDTHH:mm:ssZ` (e.g., `2025-08-15T14:30:00Z`).
  - Without `picker_utc`: `YYYY-MM-DDTHH:mm:ss` (e.g., `2025-08-15T14:30:00`).

If the `format`, `date_format` or `time_format` option is specified, the string will follow the custom Day.js format defined.

If the `required` option is set to `false` and the field is left empty, the value will be an empty string.

If the output format is TOML, the date-time string will be represented as a native, unquoted TOML date value, time value, or date-time value, depending on the configuration, unless a custom `format` is specified. TOML output always carries millisecond precision, so the examples above are written as `2025-08-15T14:30:00.000` and `14:30:00.000`. Note also that TOML has no offset-time type, so a UTC time-only value loses its `Z` suffix and is written as a local time (e.g., `14:30:00.000`).

### Data Validation

- If the `required` option is set to `true`, the date/time value must not be an empty string.
- The date/time value must be a valid date/time string according to the specified format or ISO 8601.
- If the `pattern` option is provided, the date/time value must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the DateTime field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `datetime`.

#### Optional Options

**Breaking changes from Netlify/Decap CMS**

Sveltia CMS does not support the deprecated camelCase `dateFormat`, `timeFormat` and `pickerUtc` options. Use `date_format`, `time_format` and `picker_utc` instead.

Also, Sveltia CMS (and Decap CMS 3.1.1) has replaced the Moment.js library with Day.js for date formatting and parsing. Since [Day.js tokens](https://day.js.org/docs/en/display/format) are not 100% compatible with [Moment.js tokens](https://momentjs.com/docs/#/displaying/format/), this could be a breaking change in certain cases. Check your `format`, `date_format` and `time_format` options if you’re migrating from Netlify CMS or earlier versions of Decap CMS.

##### `default`

- **Type**: `string`
- **Default**: `""`

A default date and/or time value for the field in ISO 8601 format or the specified custom format. Use `{{now}}` to set the default value to the current date and time.

##### `type`

- **Type**: `string`
- **Default**: `"datetime-local"`

The [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types) HTML attribute value for the date/time input. Accepted values:

- `"datetime-local"` (default): Accepts both date and time values.
- `"date"`: Accepts date values only; the time part is disabled.
- `"time"`: Accepts time values only; the date part is disabled.

##### `min`

- **Type**: `string`
- **Default**: `undefined`

The [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/min) HTML attribute value for the date/time input. The expected format depends on the `type` option:

- `"datetime-local"`: `YYYY-MM-DDTHH:mm`
- `"date"`: `YYYY-MM-DD`
- `"time"`: `HH:mm`

##### `max`

- **Type**: `string`
- **Default**: `undefined`

The [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/max) HTML attribute value for the date/time input. The expected format depends on the `type` option:

- `"datetime-local"`: `YYYY-MM-DDTHH:mm`
- `"date"`: `YYYY-MM-DD`
- `"time"`: `HH:mm`

##### `step`

- **Type**: `number` or `"any"`
- **Default**: `60` for `datetime-local` and `time`; `1` for `date`

The [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step) HTML attribute value for the date/time input. Accepts a positive integer or `"any"`.

- For `"datetime-local"` and `"time"` inputs, the integer represents the step in seconds (e.g. `300` for 5-minute steps).
- For `"date"` inputs, the integer represents the step in days (e.g. `7` for weekly steps).

##### `picker_utc`

- **Type**: `boolean`
- **Default**: `false`

**Use other options instead**

This option is available for backward compatibility with Netlify/Decap CMS. The newer `input_timezone` and `output_utc` options provide more flexibility and supersede this option. `picker_utc: true` is equivalent to `input_timezone: utc`.

Determines whether the date/time picker uses UTC time or the user’s local timezone. This is particularly useful when using date-only input (`type: date`); without UTC, the stored date may shift depending on the user’s timezone.

If set to `false` (default), the picker will use the local timezone of the user. If the format is date/time or time-only, the stored value will not include timezone information.

If set to `true`, the date/time picker will use UTC time instead of the local timezone. If the format is date/time or time-only, the stored value will include the `Z` suffix to indicate UTC time.

##### `input_timezone`

- **Type**: `'local' | 'utc' | string`
- **Default**: `'local'`

Timezone used by the date/time input. This option supersedes `picker_utc`. Accepted values:

- `local` (default): The browser’s local timezone is used.
- `utc`: UTC is used.
- Custom timezone name: A timezone from the [IANA timezone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) can be provided, e.g., `America/New_York`, `Asia/Tokyo`.

##### `output_utc`

- **Type**: `boolean`
- **Default**: `false`

Whether to convert stored values to UTC. This option supersedes `picker_utc`.

If `false` (default), output values preserve the timezone semantics of `input_timezone`:

- `local`: Omits timezone information (e.g., `2025-08-15T14:30:00`).
- `utc`: Appends a `Z` suffix to indicate UTC (e.g., `2025-08-15T14:30:00Z`).
- Custom timezone: Preserves the timezone offset (e.g., `2025-08-15T14:30:00-04:00` for `America/New_York`, Eastern Daylight Time).

If `true`, the input value is converted to UTC for storage. When no custom `format` is specified, a `Z` suffix is appended to the ISO 8601 output. When a custom `format` is used, the value is stored in UTC but formatted according to that pattern — which won’t include an explicit timezone indicator unless the format itself contains `Z`.

**UTC Already Implied**

Note that `input_timezone: utc` already implies UTC semantics, so `output_utc` has no additional effect in that case.

**Limited Timezone Support for Time-only Fields**

For time-only fields (`type: time` or `date_format: false`), the only timezone setting that affects the stored value is `input_timezone: utc`, which appends a `Z` suffix (e.g., `14:30:00Z`). A custom `input_timezone` and `output_utc` are ignored, and the time is stored as entered (e.g., `14:30:00`), because converting a wall-clock time to another timezone requires a reference date. Use a date/time field if you need the value converted.

##### `format`

- **Type**: `string`
- **Default**: `undefined`

A custom format for displaying and storing the date and/or time using [Day.js format tokens](https://day.js.org/docs/en/display/format). If not specified, the field will use ISO 8601 format.

**Format Recommendation**

For data portability, we recommend saving date/time values in ISO 8601 format by omitting the `format` option. Formatting is better handled in your application code. Using custom formats is generally discouraged unless you have a specific need for it, e.g., integrating with a framework that doesn’t support date formatting or requires a specific format.

##### `date_format`

- **Type**: `string` or `boolean`
- **Default**: `true`

A date storage format written in [Day.js format tokens](https://day.js.org/docs/en/display/format) if the value is a string and the `format` option is not defined. If `true`, ISO 8601 format is used unless the `format` option is defined. If `false`, date input/output is disabled.

**Use other options instead**

This option is available for backward compatibility with Netlify/Decap CMS. Use the `format` or `type` option instead. `date_format: false` is equivalent to `type: time`.

##### `time_format`

- **Type**: `string` or `boolean`
- **Default**: `true`

A time storage format written in [Day.js format tokens](https://day.js.org/docs/en/display/format) if the value is a string and the `format` option is not defined. If `true`, ISO 8601 format is used unless the `format` option is defined. If `false`, time input/output is disabled.

**Use other options instead**

This option is available for backward compatibility with Netlify/Decap CMS. Use the `format` or `type` option instead. `time_format: false` is equivalent to `type: date`.

### Examples

#### Date and Time

By default, the DateTime field includes both date/time pickers. The output is in ISO 8601 format:

```yaml [YAML]
- name: eventDateTime
  label: Event Date and Time
  widget: datetime
```

```toml [TOML]
[[fields]]
name = "eventDateTime"
label = "Event Date and Time"
widget = "datetime"
```

```json [JSON]
{
  "name": "eventDateTime",
  "label": "Event Date and Time",
  "widget": "datetime"
}
```

```js [JavaScript]
{
  name: "eventDateTime",
  label: "Event Date and Time",
  widget: "datetime",
}
```

Output example:

```yaml [YAML]
eventDateTime: 2025-08-15T14:30:00
```

```toml [TOML]
eventDateTime = 2025-08-15T14:30:00.000
```

```json [JSON]
{
  "eventDateTime": "2025-08-15T14:30:00"
}
```

#### Date-only

Set `type` to `"date"` to make the input [date only](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date):

```yaml [YAML]
- name: startDate
  label: Start Date
  widget: datetime
  type: date
```

```toml [TOML]
[[fields]]
name = "startDate"
label = "Start Date"
widget = "datetime"
type = "date"
```

```json [JSON]
{
  "name": "startDate",
  "label": "Start Date",
  "widget": "datetime",
  "type": "date"
}
```

```js [JavaScript]
{
  name: "startDate",
  label: "Start Date",
  widget: "datetime",
  type: "date",
}
```

Output example:

```yaml [YAML]
startDate: 2025-08-15
```

```toml [TOML]
startDate = 2025-08-15
```

```json [JSON]
{
  "startDate": "2025-08-15"
}
```

#### Time-only

Set `type` to `"time"` to make the input [time only](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time):

```yaml [YAML]
- name: startTime
  label: Start Time
  widget: datetime
  type: time
```

```toml [TOML]
[[fields]]
name = "startTime"
label = "Start Time"
widget = "datetime"
type = "time"
```

```json [JSON]
{
  "name": "startTime",
  "label": "Start Time",
  "widget": "datetime",
  "type": "time"
}
```

```js [JavaScript]
{
  name: "startTime",
  label: "Start Time",
  widget: "datetime",
  type: "time",
}
```

Output example:

```yaml [YAML]
startTime: 14:30:00
```

```toml [TOML]
startTime = 14:30:00.000
```

```json [JSON]
{
  "startTime": "14:30:00"
}
```

#### UTC Picker and Default Now

Set `picker_utc` to `true` to use UTC time in the date/time picker. The `default` option is set to `{{now}}` to use the current date and time as the default value:

```yaml [YAML]
- name: eventDateTimeUtc
  label: Event Date and Time (UTC)
  widget: datetime
  picker_utc: true
  default: '{{now}}'
```

```toml [TOML]
[[fields]]
name = "eventDateTimeUtc"
label = "Event Date and Time (UTC)"
widget = "datetime"
picker_utc = true
default = "{{now}}"
```

```json [JSON]
{
  "name": "eventDateTimeUtc",
  "label": "Event Date and Time (UTC)",
  "widget": "datetime",
  "picker_utc": true,
  "default": "{{now}}"
}
```

```js [JavaScript]
{
  name: "eventDateTimeUtc",
  label: "Event Date and Time (UTC)",
  widget: "datetime",
  picker_utc: true,
  default: '{{now}}',
}
```

Output example:

```yaml [YAML]
eventDateTimeUtc: 2025-08-15T14:30:00Z
```

```toml [TOML]
eventDateTimeUtc = 2025-08-15T14:30:00.000Z
```

```json [JSON]
{
  "eventDateTimeUtc": "2025-08-15T14:30:00Z"
}
```

#### Custom Format

The `format` option allows specifying a custom format for both displaying and storing the date and/or time using [Day.js format tokens](https://day.js.org/docs/en/display/format). For example, to use the format `MM/DD/YYYY HH:mm`:

```yaml [YAML]
- name: eventDateTime
  label: Event Date and Time
  widget: datetime
  format: MM/DD/YYYY HH:mm
```

```toml [TOML]
[[fields]]
name = "eventDateTime"
label = "Event Date and Time"
widget = "datetime"
format = "MM/DD/YYYY HH:mm"
```

```json [JSON]
{
  "name": "eventDateTime",
  "label": "Event Date and Time",
  "widget": "datetime",
  "format": "MM/DD/YYYY HH:mm"
}
```

```js [JavaScript]
{
  name: "eventDateTime",
  label: "Event Date and Time",
  widget: "datetime",
  format: "MM/DD/YYYY HH:mm",
}
```

Output example:

```yaml [YAML]
eventDateTime: 08/15/2025 14:30
```

```toml [TOML]
eventDateTime = "08/15/2025 14:30"
```

```json [JSON]
{
  "eventDateTime": "08/15/2025 14:30"
}
```

#### Date with Constraints

Use `min`, `max`, and `step` to restrict the allowed date range and increment. For example, to limit a booking date to the first quarter of 2026 with weekly steps:

```yaml [YAML]
- name: bookingDate
  label: Booking Date
  widget: datetime
  type: date
  min: 2026-01-01
  max: 2026-03-31
  step: 7
```

```toml [TOML]
[[fields]]
name = "bookingDate"
label = "Booking Date"
widget = "datetime"
type = "date"
min = "2026-01-01"
max = "2026-03-31"
step = 7
```

```json [JSON]
{
  "name": "bookingDate",
  "label": "Booking Date",
  "widget": "datetime",
  "type": "date",
  "min": "2026-01-01",
  "max": "2026-03-31",
  "step": 7
}
```

```js [JavaScript]
{
  name: "bookingDate",
  label: "Booking Date",
  widget: "datetime",
  type: "date",
  min: "2026-01-01",
  max: "2026-03-31",
  step: 7,
}
```

Output example:

```yaml [YAML]
bookingDate: 2026-01-08
```

```toml [TOML]
bookingDate = 2026-01-08
```

```json [JSON]
{
  "bookingDate": "2026-01-08"
}
```

#### Time with Step

Use `step` to control the time increment in seconds. For example, to allow 15-minute steps for a time-only input:

```yaml [YAML]
- name: appointmentTime
  label: Appointment Time
  widget: datetime
  type: time
  min: 09:00
  max: 17:00
  step: 900
```

```toml [TOML]
[[fields]]
name = "appointmentTime"
label = "Appointment Time"
widget = "datetime"
type = "time"
min = "09:00"
max = "17:00"
step = 900
```

```json [JSON]
{
  "name": "appointmentTime",
  "label": "Appointment Time",
  "widget": "datetime",
  "type": "time",
  "min": "09:00",
  "max": "17:00",
  "step": 900
}
```

```js [JavaScript]
{
  name: "appointmentTime",
  label: "Appointment Time",
  widget: "datetime",
  type: "time",
  min: "09:00",
  max: "17:00",
  step: 900,
}
```

Output example:

```yaml [YAML]
appointmentTime: 10:15:00
```

```toml [TOML]
appointmentTime = 10:15:00.000
```

```json [JSON]
{
  "appointmentTime": "10:15:00"
}
```

#### Custom Timezone with `input_timezone`

Use `input_timezone` to make the date/time picker use a specific timezone. For example, to allow users to schedule events in New York time:

```yaml [YAML]
- name: eventTime
  label: Event Time (New York)
  widget: datetime
  input_timezone: America/New_York
```

```toml [TOML]
[[fields]]
name = "eventTime"
label = "Event Time (New York)"
widget = "datetime"
input_timezone = "America/New_York"
```

```json [JSON]
{
  "name": "eventTime",
  "label": "Event Time (New York)",
  "widget": "datetime",
  "input_timezone": "America/New_York"
}
```

```js [JavaScript]
{
  name: "eventTime",
  label: "Event Time (New York)",
  widget: "datetime",
  input_timezone: "America/New_York",
}
```

Output example (with timezone offset preserved):

```yaml [YAML]
eventTime: 2025-08-15T14:30:00-04:00
```

```toml [TOML]
eventTime = 2025-08-15T14:30:00.000-04:00
```

```json [JSON]
{
  "eventTime": "2025-08-15T14:30:00-04:00"
}
```

#### UTC Conversion with `output_utc`

Use `output_utc: true` to store all date/time values in UTC, regardless of the user’s input timezone. This is useful for ensuring consistent data storage:

```yaml [YAML]
- name: eventTime
  label: Event Time
  widget: datetime
  input_timezone: America/New_York
  output_utc: true
```

```toml [TOML]
[[fields]]
name = "eventTime"
label = "Event Time"
widget = "datetime"
input_timezone = "America/New_York"
output_utc = true
```

```json [JSON]
{
  "name": "eventTime",
  "label": "Event Time",
  "widget": "datetime",
  "input_timezone": "America/New_York",
  "output_utc": true
}
```

```js [JavaScript]
{
  name: "eventTime",
  label: "Event Time",
  widget: "datetime",
  input_timezone: "America/New_York",
  output_utc: true,
}
```

Output example (converted to UTC with `Z` suffix):

```yaml [YAML]
eventTime: 2025-08-15T18:30:00Z
```

```toml [TOML]
eventTime = 2025-08-15T18:30:00Z
```

```json [JSON]
{
  "eventTime": "2025-08-15T18:30:00Z"
}
```

#### Local Timezone with Custom Format

Combine `input_timezone`, `output_utc`, and `format` to store values in a custom format while maintaining timezone awareness:

```yaml [YAML]
- name: publishTime
  label: Publish Time
  widget: datetime
  input_timezone: local
  output_utc: true
  format: YYYY-MM-DD HH:mm
```

```toml [TOML]
[[fields]]
name = "publishTime"
label = "Publish Time"
widget = "datetime"
input_timezone = "local"
output_utc = true
format = "YYYY-MM-DD HH:mm"
```

```json [JSON]
{
  "name": "publishTime",
  "label": "Publish Time",
  "widget": "datetime",
  "input_timezone": "local",
  "output_utc": true,
  "format": "YYYY-MM-DD HH:mm"
}
```

```js [JavaScript]
{
  name: "publishTime",
  label: "Publish Time",
  widget: "datetime",
  input_timezone: "local",
  output_utc: true,
  format: "YYYY-MM-DD HH:mm",
}
```

Output example (UTC time in custom format):

```yaml [YAML]
publishTime: 2025-08-15 18:30
```

```toml [TOML]
publishTime = "2025-08-15 18:30"
```

```json [JSON]
{
  "publishTime": "2025-08-15 18:30"
}
```

Source: https://sveltiacms.app/en/docs/fields/datetime

---

## Relation Field

The Relation field type enables users to create relationships between entries in different collections within the CMS. There are two types of relations supported, depending on the target collection type:

- Entries in an [entry collection](https://sveltiacms.app/en/docs/collections/entries)
- List items in a specific file in a [file collection](https://sveltiacms.app/en/docs/collections/files)

The Content Editor comes with the [Backlinks sidebar panel](https://sveltiacms.app/en/docs/ui/content-editor#sidebar) that shows all entries that reference the current entry via Relation fields. This makes it easy to see how entries are connected and navigate between them, for example, to see all blog posts that are tagged with a specific tag.

### User Interface

#### Editor

Radio buttons (single select) or checkboxes (multi select) for choosing related entries from another collection. If there are many entries, a dropdown with search functionality will be used instead. Use the `dropdown_threshold` option to customize when to switch to the dropdown UI.

For multi-select options with many entries, a tag input UI will be used instead of checkboxes to save space. Items can be reordered by dragging and dropping or using right/left arrow keys. Items can also be removed by clicking the ✕ icon on each item.

**Future Plans**

Currently, it’s not possible to create new related entries directly from the Relation field UI. We plan to add this feature in future releases. ([Issue #493](https://github.com/sveltia/sveltia-cms/issues/493))

#### Preview

A string or a list of strings representing the selected related entries, formatted according to the `display_fields` option.

### Data Type

A string or an array of strings, depending on whether the `multiple` option is set to `true` or `false`. Each string represents the value of the related entry as defined by the `value_field` option.

In some cases, it can also be a number or an array of numbers if the `value_field` of the related collection is of a numeric type, like an ID.

If the `required` option is set to `false` and no related entries are selected, the value will be `null` for single select or an empty array for multi select.

#### Cascading Updates

Like a relational database that cascades an update of a referenced key, Sveltia CMS keeps Relation field values pointing at the right entry when the entry they reference is renamed. Renaming a related entry with the [Slug Editor](https://sveltiacms.app/en/docs/ui/content-editor#slug-editor) rewrites every entry referencing it, in the same commit as the rename, so no references are left dangling.

This applies whenever the stored value is derived from the related entry’s identity, which covers the default `{{slug}}`, any template containing `{{slug}}`, such as `{{locale}}/{{slug}}`, and the canonical slug key. It does not apply to a `value_field` pointing at an ordinary content field, such as `{{title}}`, because such a value doesn’t change when the entry is renamed — but it does break if somebody edits that field. It’s one more reason to prefer the default `{{slug}}`, as noted under [`value_field`](#value-field).

**Cascading deletions unimplemented**

Deletions are not cascaded yet. If a related entry is deleted, entries referencing it keep the stale value, and you’ll have to clear those Relation fields yourself. The [Backlinks sidebar panel](https://sveltiacms.app/en/docs/ui/content-editor#sidebar) shows what references an entry, so it’s worth checking before you delete one. We plan to add cascading deletions in a future release.

### Data Validation

- If the `required` option is set to `true`, at least one related entry must be selected.
- If the `multiple` option is enabled, the number of selected entries must be between the `min` and `max` limits, if specified.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Relation field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `relation`.

##### `collection`

- **Type**: `string`
- **Default**: `undefined`

The name of the collection to relate to. This collection must exist in the CMS configuration, and can be either an entry collection or a file collection. If the target collection is a file collection, the `file` option must also be specified.

#### Optional Options

**Breaking changes from Netlify/Decap CMS**

Sveltia CMS does not support the deprecated camelCase `valueField`, `displayFields` and `searchFields` options. Use `value_field`, `display_fields` and `search_fields` instead.

The `options_length` option is also not supported in Sveltia CMS because the performance has been improved significantly.

##### `file`

- **Type**: `string`
- **Default**: `undefined`

The name of a file within the target [file collection](https://sveltiacms.app/en/docs/collections/files) to relate to. Required if the target collection is a file collection.

##### `value_field`

- **Type**: `string`
- **Default**: `{{slug}}`

The field from the related collection to use as the value for the relation. This field’s value will be stored in the entry using the Relation field. It can be one of the following:

- `{{slug}}`: Use the slug of the related entry.
- A field name from the related collection, e.g., `id` or `title`.
- A template string that references fields in the related collection using the syntax `{{field_name}}`. For example, `{{fields.id}}` or `{{fields.title}}`.
- `translationKey`, or any other key configured with the `i18n.canonical_slug.key` option: Use the canonical slug of the related entry, which is shared across locales. See [below](#referencing-entries-across-locales).

The `{{locale}}` template tag can be used to include the current locale in the value field, e.g. `{{locale}}/{{slug}}`, which is useful for [i18n support](https://sveltiacms.app/en/docs/i18n).

When using template strings, keep the following in mind:

- A field named `slug` must be prefixed with `fields.` like `{{fields.slug}}` to avoid ambiguity with the special `{{slug}}` variable.
- Nested fields can also be referenced using dot notation, e.g., `{{author.name}}`.
- To reference list items, use a wildcard `*` for the index, e.g., `{{tags.*}}` or `{{gallery.*.image}}`. This works for a list field with the `field` or `fields` option.

The value field must be unique across all entries in the related collection to avoid conflicts. For example, using `{{title}}` as the value field is not recommended unless you can guarantee that all titles are unique. That’s why the default is `{{slug}}`, which is unique by design.

##### `display_fields`

- **Type**: `array` of `strings`
- **Default**: `["title"]` if `value_field` is `{{slug}}`, otherwise the value of `value_field` option

The fields from the related collection to display in the Relation field UI when selecting related entries. This should be an array of field names. The values of these fields will be concatenated and shown as the label for each related entry.

String templates can be used to customize the display format. For example, to show both first and last names from separate fields, you can use either of the following:

```yaml [YAML]
display_fields: ['{{first_name}} {{last_name}}']
```

```toml [TOML]
display_fields = ["{{first_name}} {{last_name}}"]
```

```json [JSON]
{
  "display_fields": ["{{first_name}} {{last_name}}"]
}
```

```js [JavaScript]
{
  display_fields: ["{{first_name}} {{last_name}}"],
}
```

```yaml [YAML]
display_fields: ['first_name', 'last_name']
```

```toml [TOML]
display_fields = ["first_name", "last_name"]
```

```json [JSON]
{
  "display_fields": ["first_name", "last_name"]
}
```

```js [JavaScript]
{
  display_fields: ["first_name", "last_name"],
}
```

##### `search_fields`

- **Type**: `array` of `strings`
- **Default**: value of `display_fields` option

The fields from the related collection to search against when filtering related entries in the Relation field UI. This should be an array of field names. By default, it uses the same fields as specified in the `display_fields` option.

##### `default`

- **Type**: `string`, `number`, `array of strings`, or `array of numbers`
- **Default**: `null` or `[]`

The default value for the field. Should be a string or number for single select, or an array of strings or numbers for multi select, depending on the `multiple` option.

##### `dropdown_threshold`

- **Type**: `integer`
- **Default**: `5`

The number of related entries at which to switch from radio buttons/checkboxes to a dropdown with search functionality. If the number of entries in the target collection is greater than this threshold, a dropdown will be used.

##### `multiple`

- **Type**: `boolean`
- **Default**: `false`

Whether to allow selecting multiple related entries.

##### `min`

- **Type**: `integer`
- **Default**: `0`

The minimum number of related entries required. This enables validation to ensure that users select at least this many entries. Ignored if `multiple` is set to `false`.

##### `max`

- **Type**: `integer`
- **Default**: `Infinity`

The maximum number of related entries allowed. This enables validation to prevent users from selecting more than this many entries. Ignored if `multiple` is set to `false`.

##### `filters`

- **Type**: `array` of filter objects
- **Default**: `[]`

An array of filter objects to limit the related entries shown in the Relation field UI. Each filter object has the following properties:

- `field`: The field name in the **related** collection to filter on. Use `slug` to filter by entry slug or `fields.fieldName` to filter by a content field named `fieldName` (the `fields.` prefix is required to disambiguate from the entry slug when the field is literally named `slug`).
- `values`: An array of strings or numbers representing the values to match. String values may contain the following template tags that are resolved from the **current** entry being edited:
  - `{{slug}}`: Resolved to the current entry's slug.
  - `{{fields.fieldName}}`: Resolved to the value of a field named `fieldName` in the current entry.

  Unresolvable templates (e.g. `{{slug}}` for a new, unsaved entry) are ignored, causing the filter to be skipped.

- `exclude` _(optional)_: If `true`, entries **matching** the filter are excluded instead of included. Default: `false`.

Example — show only published entries in a specific category:

```yaml [YAML]
filters:
  - field: draft
    values: [false]
  - field: category
    values: ['news', 'updates']
```

```toml [TOML]
[[filters]]
field = "draft"
values = [false]

[[filters]]
field = "category"
values = ["news", "updates"]
```

```json [JSON]
{
  "filters": [
    {
      "field": "draft",
      "values": [false]
    },
    {
      "field": "category",
      "values": ["news", "updates"]
    }
  ]
}
```

```js [JavaScript]
{
  filters: [
    {
      field: 'draft',
      values: [false],
    },
    {
      field: 'category',
      values: ['news', 'updates'],
    },
  ],
}
```

Example — exclude the current entry from a “Related Articles” Relation field (self-exclusion):

```yaml [YAML]
filters:
  - field: slug
    values: ['{{slug}}']
    exclude: true
```

```toml [TOML]
[[filters]]
field = "slug"
values = ["{{slug}}"]
exclude = true
```

```json [JSON]
{
  "filters": [
    {
      "field": "slug",
      "values": ["{{slug}}"],
      "exclude": true
    }
  ]
}
```

```js [JavaScript]
{
  filters: [
    {
      field: 'slug',
      values: ['{{slug}}'],
      exclude: true,
    },
  ],
}
```

### Examples

#### Selecting Entries from an Entry Collection

Assuming you have the following entry collection named `categories`:

```yaml [YAML]
collections:
  - name: categories
    label: Categories
    folder: content/categories
    fields:
      - name: title
        label: Title
        widget: string
      - name: slug
        label: Slug
        widget: string
      - name: description
        label: Description
        widget: text
```

```toml [TOML]
[[collections]]
name = "categories"
label = "Categories"
folder = "content/categories"
[[collections.fields]]
name = "title"
label = "Title"
widget = "string"
[[collections.fields]]
name = "slug"
label = "Slug"
widget = "string"
[[collections.fields]]
name = "description"
label = "Description"
widget = "text"
```

```json [JSON]
{
  "collections": [
    {
      "name": "categories",
      "label": "Categories",
      "folder": "content/categories",
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "widget": "string"
        },
        {
          "name": "slug",
          "label": "Slug",
          "widget": "string"
        },
        {
          "name": "description",
          "label": "Description",
          "widget": "text"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: 'categories',
      label: 'Categories',
      folder: 'content/categories',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string',
        },
        {
          name: 'slug',
          label: 'Slug',
          widget: 'string',
        },
        {
          name: 'description',
          label: 'Description',
          widget: 'text',
        },
      ],
    },
  ],
}
```

You can create a Relation field in another collection to select a single category:

```yaml [YAML]
fields:
  - name: category
    label: Category
    widget: relation
    collection: categories
    value_field: slug
    display_fields: [title]
    search_fields: [title, description]
```

```toml [TOML]
[[fields]]
name = "category"
label = "Category"
widget = "relation"
collection = "categories"
value_field = "slug"
display_fields = ["title"]
search_fields = ["title", "description"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "category",
      "label": "Category",
      "widget": "relation",
      "collection": "categories",
      "value_field": "slug",
      "display_fields": ["title"],
      "search_fields": ["title", "description"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'category',
      label: 'Category',
      widget: 'relation',
      collection: 'categories',
      value_field: 'slug',
      display_fields: ['title'],
      search_fields: ['title', 'description'],
    },
  ],
}
```

Output example when the selected category has a slug of `news`:

```yaml [YAML]
category: news
```

```toml [TOML]
category = "news"
```

```json [JSON]
{
  "category": "news"
}
```

#### Referencing a File in a File Collection, Multiple Select

Assuming you have the following `cities` file in a `data` file collection:

```yaml [YAML]
collections:
  - name: data
    label: Data
    files:
      - name: locations
        label: Locations
        file: data/locations.yaml
        fields:
          - name: cities
            label: Cities
            widget: list
            fields:
              - name: name
                label: Name
                widget: string
              - name: country
                label: Country
                widget: string
```

```toml [TOML]
[[collections]]
name = "data"
label = "Data"
[[collections.files]]
name = "locations"
label = "Locations"
file = "data/locations.yaml"
[[collections.files.fields]]
name = "cities"
label = "Cities"
widget = "list"
[[collections.files.fields.fields]]
name = "name"
label = "Name"
widget = "string"
[[collections.files.fields.fields]]
name = "country"
label = "Country"
widget = "string"
```

```json [JSON]
{
  "collections": [
    {
      "name": "data",
      "label": "Data",
      "files": [
        {
          "name": "locations",
          "label": "Locations",
          "file": "data/locations.yaml",
          "fields": [
            {
              "name": "cities",
              "label": "Cities",
              "widget": "list",
              "fields": [
                {
                  "name": "name",
                  "label": "Name",
                  "widget": "string"
                },
                {
                  "name": "country",
                  "label": "Country",
                  "widget": "string"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: 'data',
      label: 'Data',
      files: [
        {
          name: 'locations',
          label: 'Locations',
          file: 'data/locations.yaml',
          fields: [
            {
              name: 'cities',
              label: 'Cities',
              widget: 'list',
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string',
                },
                {
                  name: 'country',
                  label: 'Country',
                  widget: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

You can create a Relation field in another collection to select multiple cities from the `locations` file:

```yaml [YAML]
fields:
  - name: favorite_cities
    label: Favorite Cities
    widget: relation
    collection: data
    file: locations
    multiple: true
    min: 1
    max: 3
    value_field: '{{cities.*.name}}'
    display_fields: ['{{cities.*.name}}, {{cities.*.country}}']
    search_fields: ['{{cities.*.name}}']
```

```toml [TOML]
[[fields]]
name = "favorite_cities"
label = "Favorite Cities"
widget = "relation"
collection = "data"
file = "locations"
multiple = true
min = 1
max = 3
value_field = "{{cities.*.name}}"
display_fields = ["{{cities.*.name}}, {{cities.*.country}}"]
search_fields = ["{{cities.*.name}}"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "favorite_cities",
      "label": "Favorite Cities",
      "widget": "relation",
      "collection": "data",
      "file": "locations",
      "multiple": true,
      "min": 1,
      "max": 3,
      "value_field": "{{cities.*.name}}",
      "display_fields": ["{{cities.*.name}}, {{cities.*.country}}"],
      "search_fields": ["{{cities.*.name}}"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'favorite_cities',
      label: 'Favorite Cities',
      widget: 'relation',
      collection: 'data',
      file: 'locations',
      multiple: true,
      min: 1,
      max: 3,
      value_field: '{{cities.*.name}}',
      display_fields: ['{{cities.*.name}}, {{cities.*.country}}'],
      search_fields: ['{{cities.*.name}}'],
    },
  ],
}
```

Note that a wildcard (`*`) is used in the `value_field`, `display_fields`, and `search_fields` options to reference list items within the `cities` field.

Output example when the selected favorite cities are “San Francisco”, “Tokyo”, and “Paris”:

```yaml [YAML]
favorite_cities:
  - San Francisco
  - Tokyo
  - Paris
```

```toml [TOML]
favorite_cities = ["San Francisco", "Tokyo", "Paris"]
```

```json [JSON]
{
  "favorite_cities": ["San Francisco", "Tokyo", "Paris"]
}
```

#### Referencing Entries Across Locales

When [entry slugs are localized](https://sveltiacms.app/en/docs/i18n#localizing-entry-slugs), each localized entry stores the default locale’s slug in an extra `translationKey` property. Unlike `{{slug}}`, that property holds the same value in every locale, so it can be used as the value field to reference an entry regardless of the locale being edited:

```yaml [YAML]
fields:
  - name: parent
    label: Parent Page
    widget: relation
    i18n: true
    collection: pages
    value_field: translationKey
    display_fields: [title]
    search_fields: [title]
```

```toml [TOML]
[[fields]]
name = "parent"
label = "Parent Page"
widget = "relation"
i18n = true
collection = "pages"
value_field = "translationKey"
display_fields = ["title"]
search_fields = ["title"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "parent",
      "label": "Parent Page",
      "widget": "relation",
      "i18n": true,
      "collection": "pages",
      "value_field": "translationKey",
      "display_fields": ["title"],
      "search_fields": ["title"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'parent',
      label: 'Parent Page',
      widget: 'relation',
      i18n: true,
      collection: 'pages',
      value_field: 'translationKey',
      display_fields: ['title'],
      search_fields: ['title'],
    },
  ],
}
```

The `translationKey` property is not defined as a field, but it’s still a valid value field. If you have renamed the property with the [`i18n.canonical_slug.key`](https://sveltiacms.app/en/docs/i18n#localizing-entry-slugs) option, such as `ref` for Jekyll, use that key instead.

Source: https://sveltiacms.app/en/docs/fields/relation

---

## Compute Field

The Compute field type displays read-only computed values based on other fields in the entry. It automatically updates the displayed value when the dependent fields change.

### User Interface

#### Editor

Read-only display of computed values based on other fields in the entry. The value is automatically updated when the dependent fields change.

#### Preview

A read-only display of the computed value.

### Data Type

A string representing the computed value.

If the `{{index}}` variable is used within a list, the value will be a number representing the current index of the item in the list.

### Data Validation

No specific data validation is applied to the Compute field, as its value is derived from other fields.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Compute field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `compute`.

##### `value`

- **Type**: `string`

The value can be computed using a template string that references other fields. It supports:

- A value template that defines how to compute the field’s value. It can include references to other fields using the syntax `{{fields.name}}`, where `name` is the name of the field to reference. [String transformations](https://sveltiacms.app/en/docs/string-transformations) can be applied.
- The special variable `{{index}}` to reference the current index when used within a list. It only works inside a [List field](https://sveltiacms.app/en/docs/fields/list).

### Examples

#### Basic Example

This example demonstrates a Compute field that concatenates the values of two string fields, `first_name` and `last_name`, to create a `full_name` field.

```yaml [YAML]
fields:
  - name: first_name
    label: First Name
    widget: string
  - name: last_name
    label: Last Name
    widget: string
  - name: full_name
    label: Full Name
    widget: compute
    value: '{{fields.first_name}} {{fields.last_name}}'
```

```toml [TOML]
[[fields]]
name = "first_name"
label = "First Name"
widget = "string"
[[fields]]
name = "last_name"
label = "Last Name"
widget = "string"
[[fields]]
name = "full_name"
label = "Full Name"
widget = "compute"
value = "{{fields.first_name}} {{fields.last_name}}"
```

```json [JSON]
{
  "fields": [
    {
      "name": "first_name",
      "label": "First Name",
      "widget": "string"
    },
    {
      "name": "last_name",
      "label": "Last Name",
      "widget": "string"
    },
    {
      "name": "full_name",
      "label": "Full Name",
      "widget": "compute",
      "value": "{{fields.first_name}} {{fields.last_name}}"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'first_name',
      label: 'First Name',
      widget: 'string',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      widget: 'string',
    },
    {
      name: 'full_name',
      label: 'Full Name',
      widget: 'compute',
      value: '{{fields.first_name}} {{fields.last_name}}',
    },
  ];
}
```

Output example when `first_name` is “John” and `last_name` is “Doe“:

```yaml [YAML]
first_name: John
last_name: Doe
full_name: John Doe
```

```toml [TOML]
first_name = "John"
last_name = "Doe"
full_name = "John Doe"
```

```json [JSON]
{
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe"
}
```

```js [JavaScript]
{
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
}
```

#### Email Link

This example demonstrates a Compute field that generates a mailto link using an email address from another String field.

```yaml [YAML]
fields:
  - name: contact_email
    label: Contact Email
    widget: string
    type: email
  - name: contact_email_link
    label: Contact Email Link
    widget: compute
    value: 'mailto:{{fields.contact_email}}?subject=Inquiry'
```

```toml [TOML]
[[fields]]
name = "contact_email"
label = "Contact Email"
widget = "string"
type = "email"
[[fields]]
name = "contact_email_link"
label = "Contact Email Link"
widget = "compute"
value = "mailto:{{fields.contact_email}}?subject=Inquiry"
```

```json [JSON]
{
  "fields": [
    {
      "name": "contact_email",
      "label": "Contact Email",
      "widget": "string",
      "type": "email"
    },
    {
      "name": "contact_email_link",
      "label": "Contact Email Link",
      "widget": "compute",
      "value": "mailto:{{fields.contact_email}}?subject=Inquiry"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'contact_email',
      label: 'Contact Email',
      widget: 'string',
      type: 'email',
    },
    {
      name: 'contact_email_link',
      label: 'Contact Email Link',
      widget: 'compute',
      value: 'mailto:{{fields.contact_email}}?subject=Inquiry',
    },
  ];
}
```

Output example when `contact_email` is “contact@example.com“:

```yaml [YAML]
contact_email: contact@example.com
contact_email_link: mailto:contact@example.com?subject=Inquiry
```

```toml [TOML]
contact_email = "contact@example.com"
contact_email_link = "mailto:contact@example.com?subject=Inquiry"
```

```json [JSON]
{
  "contact_email": "contact@example.com",
  "contact_email_link": "mailto:contact@example.com?subject=Inquiry"
}
```

```js [JavaScript]
{
  contact_email: 'contact@example.com',
  contact_email_link: 'mailto:contact@example.com?subject=Inquiry';
}
```

#### Using `index` in a List

The `{{index}}` variable can be used within a list to reference the current item’s index. In this example, we create a list of items where each item has a computed `index` based on its index in the list.

```yaml [YAML]
fields:
  - name: items
    label: Items
    widget: list
    fields:
      - name: name
        label: Name
        widget: string
      - name: index
        label: Item Index
        widget: compute
        value: '{{index}}'
```

```toml [TOML]
[[fields]]
name = "items"
label = "Items"
widget = "list"

[[fields.fields]]
name = "name"
label = "Name"
widget = "string"

[[fields.fields]]
name = "index"
label = "Item Index"
widget = "compute"
value = "{{index}}"
```

```json [JSON]
{
  "fields": [
    {
      "name": "items",
      "label": "Items",
      "widget": "list",
      "fields": [
        {
          "name": "name",
          "label": "Name",
          "widget": "string"
        },
        {
          "name": "index",
          "label": "Item Index",
          "widget": "compute",
          "value": "{{index}}"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'items',
      label: 'Items',
      widget: 'list',
      fields: [
        {
          name: 'name',
          label: 'Name',
          widget: 'string',
        },
        {
          name: 'index',
          label: 'Item Index',
          widget: 'compute',
          value: '{{index}}',
        },
      ],
    },
  ];
}
```

Output example when three items are added with names “Apple“, “Banana“, and “Cherry“:

```yaml [YAML]
items:
  - name: Apple
    index: 0
  - name: Banana
    index: 1
  - name: Cherry
    index: 2
```

```toml [TOML]
[[items]]
name = "Apple"
index = 0
[[items]]
name = "Banana"
index = 1
[[items]]
name = "Cherry"
index = 2
```

```json [JSON]
{
  "items": [
    {
      "name": "Apple",
      "index": 0
    },
    {
      "name": "Banana",
      "index": 1
    },
    {
      "name": "Cherry",
      "index": 2
    }
  ]
}
```

Source: https://sveltiacms.app/en/docs/fields/compute

---

## UUID Field

The UUID field type provides a read-only field that automatically generates and displays a Universally Unique Identifier (UUID). It’s useful for uniquely identifying entries within the CMS.

### User Interface

#### Editor

Read-only display of a [UUID](https://developer.mozilla.org/en-US/docs/Glossary/UUID) (Universally Unique Identifier) value. The UUID is automatically generated when a new entry is created and cannot be modified by the user.

#### Preview

A read-only view of the UUID value.

### Data Type

A string representing a UUID in the standard 36-character format (e.g., `df733d7e-d2f7-4e4f-8f27-803046b64040`). Alphabetic characters are in lowercase.

If `use_b32_encoding` is set to true, the UUID will be represented in a 26-character [Base32](https://en.wikipedia.org/wiki/Base32) format (e.g., `C5T6KX3M6N7G4Y2Z1A0B9C8D7E`).

### Data Validation

No specific data validation is applied to the UUID field, as its value is automatically generated.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the UUID field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `uuid`.

#### Optional Options

**Deprecation Notice**

The `read_only` option has been deprecated in favor of the `readonly` common field option. The `read_only` option will be removed in Sveltia CMS v1.0.0. If you are upgrading from an older version, update your configuration accordingly.

##### `default`

- **Type**: `string`
- **Default**: A newly generated UUID

The default value for the field. If not provided, a new UUID will be generated when the entry is created.

##### `prefix`

- **Type**: `string`
- **Default**: `""`

A string prefix to prepend to the generated UUID. Useful for adding context or categorization to the UUID.

##### `use_b32_encoding`

- **Type**: `boolean`
- **Default**: `false`

Whether to use Base32 encoding for the UUID. If set to `true`, the UUID will be represented in a 26-character Base32 format instead of the standard 36-character format.

### Examples

#### Basic UUID Field

This example demonstrates a basic UUID field that generates a standard UUID.

```yaml [YAML]
- name: product_id
  label: Product ID
  widget: uuid
```

```toml [TOML]
[[fields]]
name = "product_id"
label = "Product ID"
widget = "uuid"
```

```json [JSON]
{
  "name": "product_id",
  "label": "Product ID",
  "widget": "uuid"
}
```

```js [JavaScript]
{
  name: 'product_id',
  label: 'Product ID',
  widget: 'uuid',
}
```

Output example:

```yaml [YAML]
product_id: df733d7e-d2f7-4e4f-8f27-803046b64040
```

```toml [TOML]
product_id = "df733d7e-d2f7-4e4f-8f27-803046b64040"
```

```json [JSON]
{
  "product_id": "df733d7e-d2f7-4e4f-8f27-803046b64040"
}
```

#### UUID Field with Prefix and Base32 Encoding

This example demonstrates a UUID field that includes a prefix and uses Base32 encoding.

```yaml [YAML]
- name: order_id
  label: Order ID
  widget: uuid
  prefix: ORD-
  use_b32_encoding: true
```

```toml [TOML]
[[fields]]
name = "order_id"
label = "Order ID"
widget = "uuid"
prefix = "ORD-"
use_b32_encoding = true
```

```json [JSON]
{
  "name": "order_id",
  "label": "Order ID",
  "widget": "uuid",
  "prefix": "ORD-",
  "use_b32_encoding": true
}
```

```js [JavaScript]
{
  name: 'order_id',
  label: 'Order ID',
  widget: 'uuid',
  prefix: 'ORD-',
  use_b32_encoding: true,
}
```

Output example:

```yaml [YAML]
order_id: ORD-C5T6KX3M6N7G4Y2Z1A0B9C8D7E
```

```toml [TOML]
order_id = "ORD-C5T6KX3M6N7G4Y2Z1A0B9C8D7E"
```

```json [JSON]
{
  "order_id": "ORD-C5T6KX3M6N7G4Y2Z1A0B9C8D7E"
}
```

Source: https://sveltiacms.app/en/docs/fields/uuid

---

## Map Field

The Map field type allows users to select geographic locations using an interactive map interface. It supports selecting single points, lines, or polygons, and stores the selected geometry as a GeoJSON string.

### User Interface

#### Editor

An interactive map interface that enables users to select geographic locations visually by clicking on the map. The map supports zooming and panning for better precision. It also includes the following features:

- A search box to find locations by name or address.
- A button to center the map on the user’s current location using the browser’s [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
- A Clear button to remove the selected location(s).

The map UI is built with the [Leaflet](https://leafletjs.com/) and [Terra Draw](https://github.com/JamesLMilner/terra-draw) libraries, utilizing [OpenStreetMap](https://www.openstreetmap.org/) tiles and the [Nominatim](https://nominatim.org/) search API. You don’t need to set up any API keys to use those free services.

**CSP**

You may need to update your Content Security Policy (CSP) to allow loading map tiles and making search API requests. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

**Future Plans**

We plan to add support for additional map providers in the future, such as Mapbox and Google Maps, to offer more customization options.

#### Preview

The data output, which is a GeoJSON string, is displayed. See below for details on the data format.

### Data Type

A stringified [GeoJSON](https://geojson.org/) object representing the selected geometry. Depending on the selected `type` option, the GeoJSON will be in one of the following formats:

```
{"type":"Point","coordinates":[lng,lat]}
```

```
{"type":"LineString","coordinates":[[lng1,lat1],[lng2,lat2],...]}
```

```
{"type":"Polygon","coordinates":[[[lng1,lat1],[lng2,lat2],[lng3,lat3],...]]}
```

You need to parse this string to work with the GeoJSON data in your application.

**Coordinate Order**

The coordinates are in the order of longitude first, then latitude, as per the GeoJSON spec. Some libraries use latitude-longitude order, so be cautious when integrating with other mapping tools.

If the `required` option is set to `false` and locations are not selected, the value will be an empty string.

### Data Validation

- If the `required` option is set to `true`, a valid GeoJSON string must be provided.
- The GeoJSON string must conform to the specified geometry `type` (Point, LineString, or Polygon).
- Coordinates must be valid latitude and longitude values.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Map field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `map`.

#### Optional Options

##### `default`

- **Type**: `string`
- **Default**: `""`

A default GeoJSON string to prepopulate the field. The string should be a valid GeoJSON representation of the selected geometry. The `type` option should match the geometry type of the default value.

##### `decimals`

- **Type**: `number`
- **Default**: `7`

Number of decimal places for coordinates. Higher values provide more precision but may increase the size of the stored data.

##### `type`

- **Type**: `string`
- **Default**: `Point`

Type of geometry to select. Supported values are:

- `Point`: Allows selecting a single location on the map.
- `LineString`: Allows drawing a line by selecting multiple points.
- `Polygon`: Allows drawing a polygon by selecting multiple points that form a closed shape.

##### `center`

- **Type**: `[number, number]`
- **Default**: `[0, 0]`

Default center coordinates of the map as `[longitude, latitude]`, following the GeoJSON coordinate order. This is used as the initial map view when no value is set. If a value already exists, the map centers on the stored geometry instead.

##### `zoom`

- **Type**: `number`
- **Default**: `2`

Default zoom level of the map when no value is set.

### Examples

#### Basic Map Field

This example shows a simple Map field configuration, which allows users to select a single location on the map.

```yaml [YAML]
- name: location
  label: Location
  widget: map
```

```toml [TOML]
[[fields]]
name = "location"
label = "Location"
widget = "map"
```

```json [JSON]
{
  "name": "location",
  "label": "Location",
  "widget": "map"
}
```

```js [JavaScript]
{
  name: 'location',
  label: 'Location',
  widget: 'map',
}
```

Output example:

```yaml [YAML]
location: '{"type":"Point","coordinates":[-122.4194015,37.7749144]}'
```

```toml [TOML]
location = '{"type":"Point","coordinates":[-122.4194015,37.7749144]}'
```

```json [JSON]
{
  "location": "{\"type\":\"Point\",\"coordinates\":[-122.4194015,37.7749144]}"
}
```

#### LineString Geometry with Decimals

This example shows a Map field configured to select a LineString geometry with a specified number of decimal places for coordinates.

```yaml [YAML]
- name: route
  label: Route
  widget: map
  type: LineString
  decimals: 5
```

```toml [TOML]
[[fields]]
name = "route"
label = "Route"
widget = "map"
type = "LineString"
decimals = 5
```

```json [JSON]
{
  "name": "route",
  "label": "Route",
  "widget": "map",
  "type": "LineString",
  "decimals": 5
}
```

```js [JavaScript]
{
  name: 'route',
  label: 'Route',
  widget: 'map',
  type: 'LineString',
  decimals: 5,
}
```

Output example:

```yaml [YAML]
route: '{"type":"LineString","coordinates":[[-122.41940,37.77490],[-122.41800,37.77550]]}'
```

```toml [TOML]
route = '{"type":"LineString","coordinates":[[-122.41940,37.77490],[-122.41800,37.77550]]}'
```

```json [JSON]
{
  "route": "{\"type\":\"LineString\",\"coordinates\":[[-122.41940,37.77490],[-122.41800,37.77550]]}"
}
```

#### Default Center and Zoom

This example shows a Map field configured with a default center and zoom level, so the map opens in a specific region when no value is set.

```yaml [YAML]
- name: location
  label: Location
  widget: map
  center: [-122.4194, 37.7749]
  zoom: 12
```

```toml [TOML]
[[fields]]
name = "location"
label = "Location"
widget = "map"
center = [-122.4194, 37.7749]
zoom = 12
```

```json [JSON]
{
  "name": "location",
  "label": "Location",
  "widget": "map",
  "center": [-122.4194, 37.7749],
  "zoom": 12
}
```

```js [JavaScript]
{
  name: 'location',
  label: 'Location',
  widget: 'map',
  center: [-122.4194, 37.7749],
  zoom: 12,
}
```

Source: https://sveltiacms.app/en/docs/fields/map
