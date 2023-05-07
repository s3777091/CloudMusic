CREATE TABLE Users (
    idx      INTEGER      NOT NULL AUTO_INCREMENT,
    fullName VARCHAR(255) NOT NULL,
    Email    VARCHAR(255) NOT NULL,
    Password VARCHAR(255),
    Avatar   VARCHAR(255) NOT NULL,
    isActive SMALLINT(1)  NOT NULL DEFAULT 0,
    isLogin  SMALLINT(1)  NOT NULL DEFAULT 0,
    CONSTRAINT `PK_Users` PRIMARY KEY (`idx`)
);

CREATE TABLE SongLike (
    encodeid VARCHAR(100) NOT NULL,
    image    VARCHAR(255) NOT NULL,
    name     VARCHAR(255) NOT NULL,
    artist   VARCHAR(255),
    songurl  VARCHAR(255),
    user_idx INTEGER      NOT NULL,
    FOREIGN KEY (user_idx) REFERENCES Users (idx),
    PRIMARY KEY (encodeid, user_idx)
);


CREATE TABLE AlbumLike (
    encodeid VARCHAR(100) NOT NULL,
    image    VARCHAR(255) NOT NULL,
    name     VARCHAR(255) NOT NULL,
    artist   VARCHAR(255),
    user_idx INTEGER      NOT NULL,
    FOREIGN KEY (user_idx) REFERENCES Users (idx),
    PRIMARY KEY (encodeid, user_idx)
);


CREATE TABLE Friend (
    image     VARCHAR(255) NOT NULL,
    name      VARCHAR(255) NOT NULL,
    songLike  INTEGER      NOT NULL,
    albumLike INTEGER      NOT NULL,
    user_idx  INTEGER      NOT NULL,
    FOREIGN KEY (user_idx) REFERENCES Users (idx),
    PRIMARY KEY (name, user_idx)
);

