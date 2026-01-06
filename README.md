# Lighthouse metrics in your GitHub profile

Automatically update your pinned gist with your site's Lighthouse metrics.

<p style="text-align: center;" align="center">
<a href="https://github.com/abordage" title="Lighthouse Metrics Gist">
    <img alt="Lighthouse Metrics Gist" 
         src="https://github.com/abordage/lighthouse-box/blob/main/docs/images/lighthouse-box-example-830-rounded.png?raw=true">
</a>
</p>

<p style="text-align: center;" align="center">

<a href="https://github.com/abordage" title="language">
    <img alt="language" src="https://img.shields.io/badge/language-typescript-blue">
</a>

<a href="https://github.com/abordage/lighthouse-box/blob/main/LICENSE.md" title="License">
    <img alt="License" src="https://img.shields.io/github/license/abordage/lighthouse-box">
</a>

</p>

## Features

- **5 Lighthouse categories**: Performance, Accessibility, Best Practices, SEO, and PWA
- **Emoji badges**: Optional visual indicators for scores
- **Pinned Gist**: Perfect for your GitHub profile
- **Automatic updates**: Schedule daily runs with GitHub Actions

> **Note**: This action uses two versions of Lighthouse to provide complete metrics:
> - **Lighthouse 12** for Performance, Accessibility, Best Practices, and SEO
> - **Lighthouse 11** for PWA (Progressive Web App) category
>
> This is because Google removed the PWA category from Lighthouse 12+. We use Lighthouse 11 specifically to preserve PWA scoring with full service worker checks.

## How it works

1. [**Create**](https://github.com/settings/tokens/new) a token in your GitHub account settings with the `gist scope`
   only and **copy** it
2. [**Create**](https://gist.github.com) a new **public** Gist and copy ID from url (string after last slash)
3. **Fork** this repo
4. Go to **Settings** > **Secrets** > **Actions secrets** in **your fork**
5. **Create** new **Environment secrets:**
    - `GH_TOKEN`: GitHub token generated earlier
    - `GIST_ID`: your Gist ID
    - `URL`: your url

It's all. Go to **Actions** > **Lighthouse Metrics** and **Run workflow**. Gist should update and show Lighthouse metrics.
Next, statistics will be updated automatically every day. Pin this gist on your profile!

## Usage in your workflow

```yaml
- name: Lighthouse Box
  uses: abordage/lighthouse-box@v2
  with:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}
    GIST_ID: ${{ secrets.GIST_ID }}
    TEST_URL: 'https://example.com'
```

### With all options

```yaml
- name: Lighthouse Box
  uses: abordage/lighthouse-box@v2
  with:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}
    GIST_ID: ${{ secrets.GIST_ID }}
    TEST_URL: 'https://example.com'
    GIST_TITLE: 'My Portfolio'
    FORM_FACTOR: 'desktop'
    RESULT_BADGE: 'true'
    PRINT_SUMMARY: 'true'
```

### Inputs

| Input           | Description                                   | Required | Default        |
|-----------------|-----------------------------------------------|----------|----------------|
| `GH_TOKEN`      | GitHub token with gist scope                  | Yes      | -              |
| `GIST_ID`       | ID of the Gist to update                      | Yes      | -              |
| `TEST_URL`      | URL to run Lighthouse audit on                | Yes      | -              |
| `GIST_TITLE`    | Custom title for the Gist (before date)       | No       | `My website`   |
| `FORM_FACTOR`   | Device type: `mobile` or `desktop`            | No       | `mobile`       |
| `PRINT_SUMMARY` | Print summary to GitHub Actions               | No       | `true`         |
| `RESULT_BADGE`  | Show emoji badges in Gist                     | No       | `false`        |


## Feedback

If you have any feedback, comments or suggestions, please feel free to open an issue within this repository.

## Contributing

Please see [CONTRIBUTING](https://github.com/abordage/.github/blob/main/CONTRIBUTING.md) for details.

## Credits

- Pavel Bychko ([abordage](https://github.com/abordage))
- [All Contributors](https://github.com/abordage/lighthouse-box/graphs/contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
