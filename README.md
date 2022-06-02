# Lighthouse metrics in your GitHub profile

Automatically update your pinned gist with your site's Lighthouse metrics.

<p style="text-align: center;" align="center">
<a href="https://github.com/abordage" title="Lighthouse Metrics Gist">
    <img alt="Lighthouse Metrics Gist" 
         src="https://github.com/abordage/lighthouse-box/blob/master/docs/images/lighthouse-box-example-830-rounded.png">
</a>
</p>


<p style="text-align: center;" align="center">

<a href="https://github.com/abordage" title="language">
    <img alt="language" src="https://img.shields.io/badge/language-typescript-blue">
</a>

<a href="https://scrutinizer-ci.com/g/abordage/lighthouse-box/" title="Scrutinizer Quality Score">
    <img alt="Scrutinizer Quality Score" 
         src="https://scrutinizer-ci.com/g/abordage/lighthouse-box/badges/quality-score.png?b=master">
</a>


<a href="https://github.com/abordage/lighthouse-box/blob/master/LICENSE.md" title="License">
    <img alt="License" src="https://img.shields.io/github/license/abordage/lighthouse-box">
</a>

</p>


[▶ **See example**](https://github.com/abordage)

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

It's all. Go to **Actions** > **Update Gist** and **Run workflow**. Gist should update and show Lighthouse metrics.
Next, statistics will be updated automatically every day. Pin this gist on your profile!

> Inspired from [awesome pinned-gist project](https://github.com/matchai/awesome-pinned-gists)

## Feedback

If you have any feedback, comments or suggestions, please feel free to open an issue within this repository.

## Contributing

Please see [CONTRIBUTING](https://github.com/abordage/.github/blob/master/CONTRIBUTING.md) for details.

## Credits

- Pavel Bychko ([abordage](https://github.com/abordage))
- [All Contributors](https://github.com/abordage/lighthouse-box/graphs/contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
