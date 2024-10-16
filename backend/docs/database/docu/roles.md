In PostgreSQL, roles are used to manage access and permissions, and they can function either as **login roles** (users) or **group roles** (groups). Understanding the difference between these two types of roles is crucial for effectively managing database access control.

### 1. **Login Role (User Role)**

A **login role** is a role that can **authenticate and connect** to a PostgreSQL instance. It represents a user or service account that can access the database with a username and password (or other authentication methods). 

#### Key Characteristics:
- **Can Log In**: A login role is assigned the attribute `LOGIN`, which allows it to connect to the PostgreSQL server.
- **Credentials**: Typically has a password associated with it.
- **Can Own Objects**: Login roles can own tables, schemas, databases, etc.
- **Personalized**: Often represents an individual user or service with specific access needs.
  
#### Example:
You can create a login role like this:

```sql
CREATE ROLE dev WITH LOGIN PASSWORD 'securepassword';
```

Here, `dev` is a login role that can authenticate and log into the database using the provided password.

#### Common Usage:
- **Individual users**: Developers, administrators, or users that need direct access to the database.
- **Service accounts**: Applications or automated processes that require database access.

---

### 2. **Group Role (Non-login Role)**

A **group role** is a role that acts like a group, used for **organizing other roles**. Group roles themselves **cannot log in** but are used to manage and aggregate permissions for multiple users (login roles). A group role is a way to define a set of common privileges that can be granted to multiple users by making them members of the group.

#### Key Characteristics:
- **Cannot Log In**: Group roles do not have the `LOGIN` attribute, meaning they cannot authenticate and connect directly to the database.
- **Membership-Based**: Other roles (typically login roles) can be made members of a group role to inherit its permissions.
- **Centralized Permission Management**: A group role allows for easy permission management by assigning privileges to the group, and then adding or removing users from the group.
  
#### Example:
You can create a group role like this:

```sql
CREATE ROLE developers;
```

This `developers` role is a group role that can be used to aggregate permissions. It cannot log into the database.

You could then grant privileges to this group role, and add members:

```sql
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO developers;
GRANT developers TO dev, test;
```

In this case:
- The `developers` group role is granted read and write access to all tables in the `public` schema.
- `dev` and `test` (login roles) inherit the privileges of the `developers` group role.

#### Common Usage:
- **Team or department-based roles**: You can create group roles for specific teams, like `developers`, `admins`, or `analysts`, to organize and manage permissions more easily.
- **Role aggregation**: Instead of managing permissions individually for each user, you assign them to a group role, and then add or remove members to manage access.

---

### Summary Table: **Login Role vs Group Role**

| Feature            | Login Role (User)                            | Group Role (Non-login Role)                               |
|--------------------|----------------------------------------------|----------------------------------------------------------|
| **Can log in**      | Yes (`LOGIN` attribute).                     | No (cannot log in, no `LOGIN` attribute).                 |
| **Purpose**         | Represents individual users or services that need direct access to the database. | Represents a group of users to aggregate permissions. |
| **Has a password**  | Typically yes (for authentication).          | No, because it cannot authenticate/log in.                |
| **Owns objects**    | Can own tables, schemas, databases, etc.     | Usually not, used for permission aggregation.             |
| **Use case**        | Directly used by users and services to connect and operate on databases. | Used to manage permissions for multiple login roles (users). |
| **Membership**      | Can be a member of group roles.              | Other roles can be members of this group role.            |

---

### Practical Example of Both Working Together:

- You might have several developers (`dev1`, `dev2`, `dev3`) who need access to a set of database tables. Instead of assigning individual permissions to each login role, you can create a group role, say `developers`, and assign the necessary privileges to that group role:

  ```sql
  CREATE ROLE developers;  -- Group Role (No Login)
  CREATE ROLE dev1 WITH LOGIN PASSWORD 'password1';  -- Login Role
  CREATE ROLE dev2 WITH LOGIN PASSWORD 'password2';  -- Login Role
  
  GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO developers;  -- Grant privileges to the group
  GRANT developers TO dev1, dev2;  -- Assign dev1 and dev2 to the developers group
  ```

Now both `dev1` and `dev2` can log in and perform the actions defined for the `developers` group, without the need to assign privileges directly to each user.

In this way, **login roles** and **group roles** work together to manage access efficiently and securely.