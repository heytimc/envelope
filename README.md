# envelope
A Database Server for Postgresql with Web Access.

## Install
Before you can use envelope, you need to compile it for your system. An alternative is to download the installer from http://envelope.xyz

#### Compile
Run the `make` command to compile envelope.
```
joseph@glock:~/Downloads/envelope
$ make
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_config.c -o src/envelope_config.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_fossil.c -o src/envelope_fossil.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_auth.c -o src/envelope_handle_auth.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_c.c -o src/envelope_handle_c.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_cluster.c -o src/envelope_handle_cluster.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_file.c -o src/envelope_handle_file.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_public.c -o src/envelope_handle_public.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_role.c -o src/envelope_handle_role.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_upload.c -o src/envelope_handle_upload.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle_webroot.c -o src/envelope_handle_webroot.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_handle.c -o src/envelope_handle.o
gcc -O2 -I/usr/local/pgsql/include -c src/envelope_main.c -o src/envelope_main.o
gcc -O2 -I/usr/local/pgsql/include -c src/postage_handle_auth.c -o src/postage_handle_auth.o
gcc -O2 -I/usr/local/pgsql/include -c src/postage_handle_c_copy.c -o src/postage_handle_c_copy.o
gcc -O2 -I/usr/local/pgsql/include -c src/postage_handle_c_fork.c -o src/postage_handle_c_fork.o
gcc -O2 -I/usr/local/pgsql/include -c src/postage_handle_c_package.c -o src/postage_handle_c_package.o
gcc -O2 -I/usr/local/pgsql/include -c src/postage_handle_c2.c -o src/postage_handle_c2.o
gcc -O2 -I/usr/local/pgsql/include -c src/postage_handle_sql.c -o src/postage_handle_sql.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_aes.c -o src/util_aes.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_base64.c -o src/util_base64.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_canonical.c -o src/util_canonical.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_cookie.c -o src/util_cookie.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_darray.c -o src/util_darray.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_error.c -o src/util_error.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_exec.c -o src/util_exec.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_file.c -o src/util_file.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_ini.c -o src/util_ini.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_jsmin.c -o src/util_jsmin.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_json_split.c -o src/util_json_split.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_request.c -o src/util_request.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_salloc.c -o src/util_salloc.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_split.c -o src/util_split.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_sql.c -o src/util_sql.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_string.c -o src/util_string.o
gcc -O2 -I/usr/local/pgsql/include -c src/util_sunlogf.c -o src/util_sunlogf.o
gcc -I/usr/local/pgsql/include -L/usr/local/pgsql/lib -Wl,-rpath -Wl,/usr/local/pgsql/lib -lssl -lpq -lcrypto src/envelope_config.o src/envelope_fossil.o src/envelope_handle_auth.o src/envelope_handle_c.o src/envelope_handle_cluster.o src/envelope_handle_file.o src/envelope_handle_public.o src/envelope_handle_role.o src/envelope_handle_upload.o src/envelope_handle_webroot.o src/envelope_handle.o src/envelope_main.o src/postage_handle_auth.o src/postage_handle_c_copy.o src/postage_handle_c_fork.o src/postage_handle_c_package.o src/postage_handle_c2.o src/postage_handle_sql.o src/util_aes.o src/util_base64.o src/util_canonical.o src/util_cookie.o src/util_darray.o src/util_error.o src/util_exec.o src/util_file.o src/util_ini.o src/util_jsmin.o src/util_json_split.o src/util_request.o src/util_salloc.o src/util_split.o src/util_sql.o src/util_string.o src/util_sunlogf.o -o envelope
```

#### Configure
The explanations for the configuration parameters are in the configuration file.
Use your favorite editor to modify the envelope.conf
```
joseph@glock:~/Downloads/envelope
$ nano envelope.conf
```

#### Run
This is a simple test run, you will need to setup a service before rolling it out to production.
```
joseph@glock:~/Downloads/envelope
$ ./envelope -c envelope.conf
```
