INSERT INTO category (id, name) VALUES 
(100001, 'Chores'),
(100002, 'School'),
(100003, 'Personal'),
(100004, 'Work');

INSERT INTO task (id, description, created, due, complete, category_id) VALUES 
(100001, 'Get groceries', '01-01-2018', '01-03-2018', false, 100001),
(100002, 'Do laundry', '01-01-2018', '01-07-2018', false, 100001),
(100003, 'Do homework', '01-02-2018', '01-03-2018', false, 100002),
(100004, 'Submit Time Reporting', '01-01-2018', '01-05-2018', false, 100004),
(100005, 'Update Blog', '01-01-2018', '01-05-2018', false, 100003),
(100006, 'Ice-Cream Date!', '01-05-2018', '01-05-2018', false, 100003);

INSERT INTO subtask (id, task_id, description, complete) VALUES 
(100001, 100001, 'Eggs', false),
(100002, 100001, 'Bread', false),
(100003, 100001, 'Ice-Cream', false),
(100004, 100003, 'Math', true),
(100005, 100003, 'Physics', false);