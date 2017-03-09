INSERT INTO fifos (name, description) VALUES ('default', 'default FIFO');

INSERT INTO fifo_members (fifo_id, name, extn, dial_string) VALUES (1, 'user1', '1000', '{member_wait=nowait}user/1000');
INSERT INTO fifo_members (fifo_id, name, extn, dial_string) VALUES (1, 'user2', '1001', '{member_wait=nowait}user/1001');
