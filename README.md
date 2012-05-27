British National Formulary
==

This is the raw HTML from the British National Formulary site, currently at version 63 (March 2012). Provided for research purposes only, or something like that.

The site starts at `www.medicinescomplete.com/mc/bnf/current/index.htm`.

How to scrape it
--

    wget --load-cookies cookies.txt --mirror --no-parent --convert-links --page-requisites http://www.medicinescomplete.com/mc/bnf/current/

cookies.txt is not provided, as it's unique for each user account. To generate your own cookies.txt, log in to the [BNF site](http://www.bnf.org/), and use the [Export Cookies](https://addons.mozilla.org/en-US/firefox/addon/export-cookies/) extension for Firefox to dump all your cookies to the missing cookies.txt file.