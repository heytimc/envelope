## Install
The Envelope team has gone to great pains to provide a free installer for Envelope users. Please visit envelope.xyz/download.html to get the latest Envelope installer for your platform. Linux, Mac OS X and FreeBSD versions are provided and should work for most users. Please submit feedback if your platform is missing or you have any trouble. The installer is maintained by nunzio at envelope.xyz. 

If for some reason you need to compile Envelope yourself, the following instructions should help. After you compile Envelope you need to put together a folder with all the appropriate assets to get an instance of Enevelope that will publish your PostgreSQL database. Those instructions are included as well, but we recommend that, even thought you compiled Envelope manually, its still a good idea to use the installer to handle instance creation. 

#### Compile
Run the `make` command to compile Envelope.
```
joseph@glock:~/Downloads/envelope
$ make
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_config.c -o src/envelope_config.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_fossil.c -o src/envelope_fossil.o
```
...et cetera...
```
gcc -O2 -I/usr/local/pgsql/include -c src/util_string.c -o src/util_string.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_sunlogf.c -o src/util_sunlogf.o
gcc -I/usr/local/pgsql/include -L/usr/local/pgsql/lib -Wl,-rpath -Wl,/usr/local/pgsql/lib -lssl -lpq -lcrypto src/envelope_config.o src/envelope_fossil.o src/envelope_handle_auth.o src/envelope_handle_c.o src/envelope_handle_cluster.o src/envelope_handle_file.o src/envelope_handle_public.o src/envelope_handle_role.o src/envelope_handle_upload.o src/envelope_handle_webroot.o src/envelope_handle.o src/envelope_main.o src/postage_handle_auth.o src/postage_handle_c_copy.o src/postage_handle_c_fork.o src/postage_handle_c_package.o src/postage_handle_c2.o src/postage_handle_sql.o src/util_aes.o src/util_base64.o src/util_canonical.o src/util_cookie.o src/util_darray.o src/util_error.o src/util_exec.o src/util_file.o src/util_ini.o src/util_jsmin.o src/util_json_split.o src/util_request.o src/util_salloc.o src/util_split.o src/util_sql.o src/util_string.o src/util_sunlogf.o -o envelope
```

#### Prepare instance directory

```
joseph@glock:~/Downloads/envelope
$ su - super

super@glock:~
$ su -

root@glock:~
$ mkdir /opt/envelope/

root@glock:~
$ mkdir /opt/envelope/fossil/

root@glock:~
$ fossil init /opt/envelope/fossil/fossil_bare
project-id: 9e5a47f8a1afe9b03e464f4c0691c55c18cf9514
server-id:  8931ef52a63ca7ba0cc74a73f6680122cea8a016
admin-user: root (initial password is "f03302")

root@glock:~
$ cp -r /Users/joseph/Downloads/envelope/production /opt/envelope/fossil/production

root@glock:~
$ cd /opt/envelope/fossil/production

root@glock:/opt/envelope/fossil/production
$ fossil open /opt/envelope/fossil/fossil_bare
project-name: <unnamed>
repository:   /opt/envelope/fossil/fossil_bare
local-root:   /opt/envelope/fossil/production/
config-db:    /var/root/.fossil
project-code: 9e5a47f8a1afe9b03e464f4c0691c55c18cf9514
checkout:     99c4ee9c5d1772448432f17708a3094e56193c38 2015-09-10 14:51:53 UTC
leaf:         open
tags:         trunk
comment:      initial empty check-in (user: root)
check-ins:    1

root@glock:/opt/envelope/fossil/production
$ fossil addremove
ADDED  dev/all/file_manager/design_property.js
ADDED  dev/all/file_manager/design_standard_elements.js
```
...et cetera...
```
ADDED  web_root/workflowproducts.com/index.html
ADDED  web_root/workflowproducts.com/js/greyspots.js
added 763 files, deleted 0 files

root@glock:/opt/envelope/fossil/production
$ fossil commit -m "initialization"
./dev/all/launchpage/resources/joseph.jpg contains binary data. Use --no-warnings or the "binary-glob" setting to disable this warning.
Commit anyhow (a=all/y/N)? a
New_Version: b8e8b21817aac20f04571400e332aa677028d8b5

root@glock:/opt/envelope/fossil/production
$ chown -R joseph /opt/envelope
```

#### Set up a domain
```
root@glock:/opt/envelope/fossil/production
$ nano /etc/hosts
```
Add records like these, replace `example.com` with your domain name.
```
127.0.0.1       example.com
127.0.0.1       www.example.com
127.0.0.1       postgres.example.com
```

#### Configure
The explanations for the configuration parameters are in the configuration file.
Use your favorite editor to modify the envelope.conf file.
```
root@glock:/opt/envelope/fossil/production
$ nano envelope.conf
```

#### Download and Install Fossil
Envelope uses Fossil as a scm for the web pages.
https://www.fossil-scm.org/download.html
Fossil has a license that is very compatible with commercial uses. If you want Envelope to use another SCM, then please submit feedback. We can always add new ones.

#### Run
This is a simple test run, you will need to setup a service startup script before rolling it out to production.
```
joseph@glock:~/Downloads/envelope
$ envelope -c /opt/envelope/envelope.conf
```

#### Set up PostgreSQL
You need to set up a role in your PostgreSQL database with an email address for the role name.
Run these commands in your PostgreSQL cluster you want to use:
```
CREATE ROLE developer_g;
CREATE ROLE trusted_g;
CREATE ROLE "user@example.com"
	LOGIN PASSWORD 'test_password'
	NOCREATEROLE  NOSUPERUSER
	INHERIT  NOCREATEDB  NOREPLICATION
	CONNECTION LIMIT -1
	VALID UNTIL 'infinity';
GRANT developer_g TO "user@example.com";
GRANT trusted_g TO "user@example.com";
```

#### Test
Go to www.example.com or whatever domain you set up. Login with your new role.
