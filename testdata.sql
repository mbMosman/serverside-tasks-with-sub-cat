INSERT INTO category (id, name) VALUES 
(1, 'Chores'),
(2, 'School'),
(3, 'Personal'),
(4, 'Work');

INSERT INTO task (id, description, created, due, complete, category_id) VALUES 
(1, 'Get groceries', '01-01-2018', '01-03-2018', false, 1),
(2, 'Do laundry', '01-01-2018', '01-07-2018', false, 1),
(3, 'Do homework', '01-02-2018', '01-03-2018', false, 2),
(4, 'Submit Time Reporting', '01-01-2018', '01-05-2018', false, 4),
(5, 'Update Blog', '01-01-2018', '01-05-2018', false, 3),
(6, 'Ice-Cream Date!', '01-05-2018', '01-05-2018', false, 3);

INSERT INTO subtask (id, task_id, description, complete) VALUES 
(1, 1, 'Eggs', false),
(2, 1, 'Bread', false),
(3, 1, 'Ice-Cream', false),
(4, 3, 'Math', true),
(5, 3, 'Physics', false);