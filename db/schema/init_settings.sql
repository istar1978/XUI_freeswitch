-- event socket settings

INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'listen-ip', '127.0.0.1', 0);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'debug', '1', 1);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'nat-map', 'false', 0);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'listen-port', '8021', 0);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'password', 'ClueCon', 0);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'apply-inbound-acl', 'loopback.auto', 1);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'password', 'ClueCon', 0);
INSERT INTO params (realm, k, v, disabled) VALUES('event_socket', 'stop-on-bind-error', 'true', 1);
