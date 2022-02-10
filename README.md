# BioExcel documents

This is the back-end of the **BioExcel documents** website.

<a href="https://mmb.irbbarcelona.org/bioexcel-docs"><img src="https://bioexcel.ebi.ac.uk/assets/img/Bioexcell_logo_1080px_transp-extra-space.png" width="200"/></a>

## Deployment

### Installation

1. Git clone this same repository on the server:

`git clone git@github.com:gbayarri/bioexcel-docs-back.git`

2. Install node modules:

`npm install`

3. Copy **.env.git** to **.env** and fill it:

```
DB_LOGIN=XXXX
DB_PASSWORD=XXXX
DB_HOST=XXXX
DB_PORT=XXXX
DB_DATABASE=XXXX

PORT=XXXX
ORIGIN=XXXX

KEY_DELETE=XXXX
```

### Configuration for apache server

1. Edit */etc/apache2/sites-available/000-default.conf* file and add:

```apacheconf
<Location /PATH/TO/PROJECT/ >
	ProxyPass http://localhost:3000/
	ProxyPassReverse http://localhost:3000/
</Location>
```

Where /PATH/TO/PROJECT/ is the folder in the server where the application has been cloned in the previous section. Note that port can be 3000 or any other declared in the **.env** file

2. Enable proxy and proxy_http modules and restart apache:

```shell
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo /etc/init.d/apache2 restart
```

3. Install PM2 for running nodeJS server as a daemon:

    * Install PM2: 
    `sudo npm install pm2 -g`

    * Launch server (from the folder where it's installed):
    `pm2 start server.js --name BioExcelDocs`

    * Make pm2 persistent in case VM has to be reset:
    `pm2 startup systemd`

## Links

[Visit the official website](https://mmb.irbbarcelona.org/bioexcel-docs)

## Credits

Genís Bayarri, Adam Hospital.

## Copyright & licensing

This website has been developed by the [MMB group](https://mmb.irbbarcelona.org) at the [IRB Barcelona](https://irbbarcelona.org).

© 2022 **Institute for Research in Biomedicine**

Licensed under the **Apache License 2.0**.

