-- the following statements are constructed to work with
-- https://www.dokuwiki.org/plugin:authpdo
--
-- select-user
SELECT
    id AS uid,
    username AS user,
    CONCAT("firstName", ' ', "lastName") AS name,
    "personalEmail" AS mail,
    salt
FROM
    users
WHERE
    username = :user;


-- select-user-groups
SELECT
    groups."groupName" AS group
FROM
    groups
    INNER JOIN "user-groups" ON "user-groups"."groupId" = groups.id;


-- check-pass
--      uses pgcrypto extension
--      enable with "CREATE EXTENSION pgcrypto;"
SELECT
    id
FROM
    users
WHERE
    username = :user
    AND "password" = encode(digest(:clear || :salt, 'sha256'), 'hex');