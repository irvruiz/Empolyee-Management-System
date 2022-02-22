USE company_db;

INSERT INTO department (name)
VALUES ("Math"), -- 1
        ("Accounting"), -- 2
        ("Finance"), -- 3
        ("Marketing"), -- 4
        ("IT"), -- 5
        ("Legal"), -- 6
        ("Board of Directors"); -- 7

INSERT INTO role ( title, salary, department_id)
VALUES ("Lead Statistician", 150000, 1), -- 1
       ("Junior Statistician", 60000, 1), -- 2
       ("Lead Accountant", 110000, 2), -- 3
       ("Accountant", 80000, 2), -- 4
       ("Lead Analysis", 130000, 3), -- 5
       ("Junior Analysis", 70000, 3), -- 6
       ("Head of Marketing", 120000, 4), -- 7
       ("Marketer", 70000, 4), -- 8
       ("Lead Software Engineer", 150000, 5), -- 9
       ("Junior Sofwater Engineer", 90000, 5), -- 10
       ("VP of Legal", 190000, 6), -- 11
       ("Lawyer", 140000, 6), -- 12
       ("CEO", 360000, 7); -- 13


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Irvin", "Ruiz", 13, NULL), -- 1
       ("Josh", "Smith", 7, NULL), -- 2
       ("Matt", "Miller", 5, NULL), -- 3
        ("Andrew", "Rodriguez", 6, NULL), -- 4
     ("James", "Johnson", 4, 2), -- 5
      ("Tyran", "Wilson", 6, 3), -- 6
       ("Omar", "Medina", 12, 4); -- 7
      