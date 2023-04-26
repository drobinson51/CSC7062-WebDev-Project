-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2023 at 10:20 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs7062project`
--

-- --------------------------------------------------------

--
-- Table structure for table `album`
--

CREATE TABLE `album` (
  `album_id` int(11) NOT NULL,
  `album_title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `album_desc` longtext NOT NULL,
  `year_of_release` year(4) NOT NULL,
  `upvote_count` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `album`
--

INSERT INTO `album` (`album_id`, `album_title`, `artist`, `album_desc`, `year_of_release`, `upvote_count`, `genre_id`) VALUES
(2, 'Living Things', 'Linkin Park', 'Considered by many to be the start of their departure from the traditional style they had become known for. Popular but polarising', 2012, 22, 1),
(3, 'Meteora', 'Linkin Park', 'The second album, considered a strong follow-up to their debut.', 2003, 35, 1),
(6, 'Hybrid Theory', 'Linkin Park', 'The band\'s first album, that skyrocketed them into fame', 2000, 39, 1),
(42, 'Sekiro OST', 'From Software', 'Yeah I am a nerd', 2019, 7, 1),
(44, 'OutRun', 'Kavinsky', 'One of Kavinsky\'s finest, the man has had a serious influence in the genre. ', 2013, 24, 5),
(48, 'Resonance', 'HOME', 'Arguably one of the internet\'s favourites, the Album exposed many to Synthwave for the first time        ', 2014, 21, 5),
(49, 'Trilogy ', 'Carpenter Brut', 'A collection of this artist\'s first 3 EPs, a great soundtrack to listen to and a real nostalgia trip to Synthwave\'s origins.   ', 2015, 0, 5),
(50, 'Music of Dune', 'Hans Zimmer', 'Hans Zimmer strikes again with a unique track that aims to replicate the far-removed culture and society of the far-future of Dune', 2021, 2, 6),
(51, 'Pursuit', 'Stuck in the Sound', 'Third album of indie French rock band, quite popular for their fierce and passioned vocals     ', 2012, 1, 2),
(58, 'Best of Dragon Ball Z: Volume 1 ', 'Bruce Faulconer', 'Contains some of the Legendary tracks of Bruce Faulconer\'s score for the dub of Dragon Ball Z considered my many to be an improvement over the original Japanese score. ', 2001, 0, 6),
(61, 'Let\'s go', 'Stuck in the Sound', 'A french indie band, famous for passionate vocals        ', 2012, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `album_review`
--

CREATE TABLE `album_review` (
  `album_review_id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `album_review`
--

INSERT INTO `album_review` (`album_review_id`, `album_id`, `review_id`) VALUES
(1, 2, 1),
(4, 42, 16),
(6, 2, 23),
(7, 48, 43),
(8, 42, 45),
(9, 48, 46),
(11, 51, 53),
(12, 50, 54),
(13, 50, 55),
(14, 42, 59),
(15, 61, 61),
(16, 6, 62),
(17, 2, 63),
(18, 2, 64);

-- --------------------------------------------------------

--
-- Table structure for table `album_tracklist`
--

CREATE TABLE `album_tracklist` (
  `album_tracklist_id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `album_tracklist`
--

INSERT INTO `album_tracklist` (`album_tracklist_id`, `album_id`, `song_id`) VALUES
(2, 3, 1),
(3, 2, 3),
(4, 3, 2),
(7, 3, 3),
(10, 6, 11),
(11, 3, 4),
(18, 42, 26),
(24, 44, 27),
(26, 3, 29),
(27, 3, 30),
(28, 3, 31),
(29, 50, 32),
(30, 44, 33),
(32, 3, 35),
(33, 44, 36),
(36, 58, 39),
(40, 61, 43);

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `user_desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`user_id`, `username`, `password`, `first_name`, `last_name`, `status`, `age`, `user_desc`) VALUES
(1, 'drobin', 'admin123', 'Guess', 'Who', 'Admin', 23, 'Original founder of site, known Linkin Park enthusiast'),
(2, 'bobbyb', 'password', 'Robert', 'Baratheon', 'Admin', 52, 'Likes the simple things in life, rock n roll is the way forward'),
(3, 'TommyBoy', 'password123', 'Thomas ', 'Richards', 'Member', 31, 'I like just about anything to be honest.'),
(4, 'registerman', 'password123', 'John', 'Register', 'Member', 24, 'Who can say what my purpose really is?'),
(5, 'JohnnySmall', 'password456', 'Johh', 'Small', 'Member', 30, 'Not as big as I look'),
(6, 'RichieRich', 'pass', 'Richard', 'Armstrong', 'Member', 19, 'Despite the name I am not wealthy'),
(7, 'HashMan', '$2a$10$jXN4dGZcwXOSyq6d3ypq7.Xyo4Y0YnHr8kxIECJAEH0SZHLeem0de', 'Hashton', 'Brown', 'Member', 26, 'Liking synthwave is 90% of my personality'),
(8, 'DemoGirl', '$2a$10$ePR9O53Br8lKpeUkS39s6egtPv57Bv8lvBkyc4AAWUsmtWKcLfnbu', 'Amelia', 'Pond', 'Member', 21, 'Just jaming out'),
(9, 'JohnBoy', '$2a$10$jHuWGJLNCh7FG1jA5bDkKecf9G9N5io2yyHs.HATBFI2gCZV.eNGa', 'John', 'Harker', 'Member', 27, 'A test'),
(10, 'Test', '$2a$10$lZ8enavUtlO.1ZL8ArXmKObQcJQQuIspYDcV16V0/q9FusHA8ZI9q', 'Test', 'Testing', 'Member', 26, 'This is a test for CS7062\'s project video demo'),
(11, 'MrIncredible', '$2a$10$Dfov7TtUd564C/mqevkdL.qylaFMQ77Pa5iBYwxahY2OxY5X.fORm', 'Bob', 'Parr', 'Admin', 45, 'Just a regular joe.'),
(12, 'JohnnieBoy', '$2a$10$TrkgbnrasMH/O41pLirDL.yC6ArjNq.CCqfOX6t0PBmbPowP/mDWq', 'Johnathan', 'Ross', 'Admin', 27, 'This man really loves the traditional music. '),
(13, 'RobBoy', '$2a$10$l9zE500ZaEMo7C.s2o525uZ.nAwLRQbkF6MEOTGyKSGt5h8RyeKUG', 'Robert', 'Johnson', 'Admin', 29, 'I am an experimental person, always willing to try new things. It\'s how I live'),
(14, 'AndyMan', '$2a$10$CotcuZV.uO9Wl0w2lIoWnOotszhz.mZIww/XKMiX7WmaMeTN3Xt7S', 'Andrew', 'Robbins', 'Admin', 31, 'I love Nu Metal');

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `genre_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `genredesc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`genre_id`, `name`, `genredesc`) VALUES
(1, 'Nu Metal', 'Nu metal, also known as nü-metal, is a subgenre of alternative metal that fuses heavy metal music with other styles like hip hop, grunge, alternative rock, hard rock, and funk.'),
(2, 'Rock and Roll', 'Rock and roll is a genre of popular music that evolved in the United States during the late 1940s and early 1950s. It originated from African-American music such as jazz, rhythm and blues, boogie-woogie, gospel, jump blues, as well as country music.'),
(3, 'Heavy Metal', 'Heavy metal is genre of rock music that includes a group of related styles that are intense, virtuosic, and powerful. Driven by the aggressive sounds of the distorted electric guitar.'),
(4, 'Electronic Dance Music', 'EDM is closely linked to House music and came about as disco declined.\n\nOriginally a cult and underground movement, EDM is now mainstream and while part of the dance music umbrella, is very much its own entity. EDM festivals, big-name DJ gigs and Vegas. '),
(5, 'Synthwave', 'An electronic music genre that is based predominantly on the music associated with action, science-fiction, and horror film soundtracks of the 1980s'),
(6, 'Soundtrack', 'A naturally somewhat undefinable genre, all it takes to be included in this genre is to be the soundtrack to anything, like a movie or a video game. The Soundtracks of Movies have always been lauded, and in recent years even Video Games have received some');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `review_content` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `user_id`, `review_content`) VALUES
(1, 3, 'Bla bla liked the album'),
(2, 2, 'Tommy\'s collection is pretty good tbh. '),
(5, 1, 'okish'),
(6, 1, 'checking redirect'),
(7, 1, 'ok let go'),
(8, 1, 'le go'),
(9, 1, 'testing in the name of'),
(10, 1, 'my lord testament'),
(11, 1, 'I think it works'),
(12, 1, 'Ok this time I swear'),
(13, 3, 'trying to fix drobin mistake'),
(14, 3, 'send it'),
(15, 1, 'one last time not really tho'),
(16, 4, 'This game was pretty hard but the OST was great'),
(17, 1, 'not my finest tbh'),
(18, 1, 'not my finest'),
(21, 1, 'tommy does it again'),
(22, 1, 'tommy does it again'),
(23, 1, 'ok '),
(24, 1, 'Did not really like it that much'),
(25, 1, 'Really soured on this one'),
(26, 1, 'Not the fondest of this one'),
(27, 1, 'Nah'),
(28, 1, 'Just trying to check'),
(29, 1, 'trying to decrement'),
(30, 3, 'Not great'),
(31, 1, 'Nothing'),
(32, 1, 'testing'),
(33, 1, 'let us go'),
(34, 1, ''),
(35, 1, 't'),
(36, 1, 'yep'),
(37, 1, 'testing'),
(38, 1, 'testing'),
(39, 1, 'I am defeated but I continue'),
(40, 2, 'Might be a bit biased but I like this one'),
(41, 1, 'yeah its good'),
(42, 1, 'Liked it'),
(43, 1, 'Liked it'),
(44, 7, 'Liked it'),
(45, 7, 'This was a hard game'),
(46, 7, 'Love Synthwave man'),
(47, 7, 'Bobby has good taste, just wished he liked synthwave more'),
(48, 7, 'Bobby has good taste, wish he liked synthwave more'),
(49, 7, 'Good, but not as good as synthwave'),
(50, 7, 'Not my taste'),
(51, 7, 'Not too bad'),
(52, 7, 'Still liked it'),
(53, 7, 'You know me and synthwave'),
(54, 8, 'Liked this movie it\'s pretty cool'),
(55, 7, 'Good movie, can\'t wait for part 3'),
(56, 7, 'Not the biggest fan of this groove tbh'),
(57, 8, 'I quite like these '),
(58, 8, 'This one was pretty great too!'),
(59, 8, 'This game was hard'),
(60, 8, 'Pretty good'),
(61, 9, 'I quite enjoyed this album, they are an underrated band'),
(62, 10, 'I quite liked hybrid theory it was a good album'),
(63, 13, 'I really love this album, Linkin Park hit out strong'),
(64, 7, 'Linkin Park really started to change themselves here, and I can\'t say I hated that');

-- --------------------------------------------------------

--
-- Table structure for table `song`
--

CREATE TABLE `song` (
  `song_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `Time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `song`
--

INSERT INTO `song` (`song_id`, `title`, `Time`) VALUES
(1, 'Figure.09', '00:03:00'),
(2, 'Don\'t Stay', '04:00:00'),
(3, 'Castle of Glass', '04:30:00'),
(4, 'One Step Closer', '04:00:00'),
(9, 'Papercut', '04:30:00'),
(11, 'By myself', '04:00:00'),
(25, 'By myself', '04:00:00'),
(26, 'Isshin the Sword Saint', '02:30:00'),
(27, 'ProtoVision', '03:30:00'),
(28, 'Prelude', '02:30:00'),
(29, 'Hit the Floor', '02:45:00'),
(30, 'Don\'t Stay', '03:07:00'),
(31, 'Lying from You', '02:44:00'),
(32, 'Paul\'s Dream', '07:03:00'),
(33, 'Drive', '03:30:00'),
(35, 'Easier to Run', '03:24:00'),
(36, 'Rampage', '02:55:00'),
(37, 'Once', '03:51:00'),
(39, 'Call Out the Dragon', '02:00:00'),
(43, 'Let\'s go ', '03:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `useralbum_review`
--

CREATE TABLE `useralbum_review` (
  `user_album_review_id` int(11) NOT NULL,
  `user_album_id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `useralbum_review`
--

INSERT INTO `useralbum_review` (`user_album_review_id`, `user_album_id`, `review_id`) VALUES
(1, 1, 2),
(2, 3, 18),
(4, 1, 22),
(5, 1, 24),
(6, 1, 25),
(7, 1, 26),
(8, 1, 27),
(9, 3, 28),
(10, 3, 29),
(11, 3, 30),
(12, 2, 31),
(13, 1, 32),
(14, 1, 33),
(15, 1, 34),
(16, 1, 35),
(17, 3, 36),
(18, 3, 37),
(19, 3, 38),
(20, 3, 39),
(21, 4, 40),
(22, 1, 41),
(23, 1, 44),
(24, 4, 48),
(25, 4, 49),
(26, 5, 50),
(27, 4, 47),
(28, 1, 51),
(29, 1, 52),
(30, 10, 56),
(31, 15, 57),
(32, 11, 58),
(33, 1, 60);

-- --------------------------------------------------------

--
-- Table structure for table `user_album`
--

CREATE TABLE `user_album` (
  `user_album_id` int(11) NOT NULL,
  `custom_album_name` varchar(255) NOT NULL,
  `album_desc` text NOT NULL,
  `upvote_count` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_album`
--

INSERT INTO `user_album` (`user_album_id`, `custom_album_name`, `album_desc`, `upvote_count`, `genre_id`, `user_id`) VALUES
(1, 'Tommy Boy\'s greatest', 'Some of my fav songs. ', 13, 1, 3),
(2, 'Test', 'Testing123', 0, 1, 1),
(3, 'TestingForOutput', 'Let us go       ', 4, 1, 1),
(4, 'Songs I listen to while driving', 'Keeps me awake and happy on the road.      ', 3, 1, 2),
(5, 'Classic Rock', 'Nothing wrong with old fashioned. ', -1, 2, 4),
(6, 'Rock and Stone', 'Rock keeps us going         ', 0, 2, 1),
(7, 'Synthwave Greats', 'What\'s better than Synthwave? Well I suppose that depends on what you like. It\'s still pretty good though. ', 0, 5, 1),
(8, 'Paramerisation Check', 'Let\'s see this work  ', 0, 1, 1),
(9, 'Johnny\'s Picks', 'Just some of my favs       ', 0, 2, 5),
(10, 'Richie\'s Groove', 'You know it\'s got to be good', -1, 1, 6),
(11, 'HashMan\'s Cryptographic Beats', 'A Collection of some of my favourite synthwave tunes.        ', 1, 5, 7),
(15, 'The Final Crypto beats', 'One too many ', 1, 5, 7),
(16, 'MyTests\'s', 'Another test for the big day        ', 0, 6, 7),
(17, 'JohnBoy\'s hits', 'Some of the songs I like ', 0, 3, 9);

-- --------------------------------------------------------

--
-- Table structure for table `user_album_tracklist`
--

CREATE TABLE `user_album_tracklist` (
  `user_album_tracklist_id` int(11) NOT NULL,
  `user_album_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_album_tracklist`
--

INSERT INTO `user_album_tracklist` (`user_album_tracklist_id`, `user_album_id`, `song_id`) VALUES
(3, 1, 1),
(4, 1, 3),
(5, 2, 26),
(6, 3, 9),
(7, 7, 28),
(8, 4, 31),
(9, 4, 31),
(10, 4, 30),
(11, 11, 27),
(13, 15, 27),
(14, 17, 25),
(15, 15, 28);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`album_id`),
  ADD KEY `FK_genre_genre_id` (`genre_id`);

--
-- Indexes for table `album_review`
--
ALTER TABLE `album_review`
  ADD PRIMARY KEY (`album_review_id`),
  ADD KEY `FK_review_review_id` (`review_id`),
  ADD KEY `FK_album_album_id4` (`album_id`);

--
-- Indexes for table `album_tracklist`
--
ALTER TABLE `album_tracklist`
  ADD PRIMARY KEY (`album_tracklist_id`),
  ADD KEY `FK_album_album_id2` (`album_id`),
  ADD KEY `FK_song_song_id` (`song_id`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`genre_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `FK_user_user_id` (`user_id`);

--
-- Indexes for table `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`song_id`);

--
-- Indexes for table `useralbum_review`
--
ALTER TABLE `useralbum_review`
  ADD PRIMARY KEY (`user_album_review_id`),
  ADD KEY `FK_review_review_id2` (`review_id`),
  ADD KEY `FK_user_album_user_albun_id` (`user_album_id`);

--
-- Indexes for table `user_album`
--
ALTER TABLE `user_album`
  ADD PRIMARY KEY (`user_album_id`),
  ADD KEY `FK_user_user_id2` (`user_id`),
  ADD KEY `FK_genre_genre_id2` (`genre_id`);

--
-- Indexes for table `user_album_tracklist`
--
ALTER TABLE `user_album_tracklist`
  ADD PRIMARY KEY (`user_album_tracklist_id`),
  ADD KEY `FK_song_song_id2` (`song_id`),
  ADD KEY `FK_user_album_user_album_id2` (`user_album_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `album`
--
ALTER TABLE `album`
  MODIFY `album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `album_review`
--
ALTER TABLE `album_review`
  MODIFY `album_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `album_tracklist`
--
ALTER TABLE `album_tracklist`
  MODIFY `album_tracklist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `genre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `song`
--
ALTER TABLE `song`
  MODIFY `song_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `useralbum_review`
--
ALTER TABLE `useralbum_review`
  MODIFY `user_album_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `user_album`
--
ALTER TABLE `user_album`
  MODIFY `user_album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user_album_tracklist`
--
ALTER TABLE `user_album_tracklist`
  MODIFY `user_album_tracklist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `FK_genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`);

--
-- Constraints for table `album_review`
--
ALTER TABLE `album_review`
  ADD CONSTRAINT `FK_album_album_id4` FOREIGN KEY (`album_id`) REFERENCES `album` (`album_id`),
  ADD CONSTRAINT `FK_review_review_id` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`);

--
-- Constraints for table `album_tracklist`
--
ALTER TABLE `album_tracklist`
  ADD CONSTRAINT `FK_album_album_id2` FOREIGN KEY (`album_id`) REFERENCES `album` (`album_id`),
  ADD CONSTRAINT `FK_song_song_id` FOREIGN KEY (`song_id`) REFERENCES `song` (`song_id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FK_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`user_id`);

--
-- Constraints for table `useralbum_review`
--
ALTER TABLE `useralbum_review`
  ADD CONSTRAINT `FK_review_review_id2` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`),
  ADD CONSTRAINT `FK_user_album_user_albun_id` FOREIGN KEY (`user_album_id`) REFERENCES `user_album` (`user_album_id`);

--
-- Constraints for table `user_album`
--
ALTER TABLE `user_album`
  ADD CONSTRAINT `FK_genre_genre_id2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`),
  ADD CONSTRAINT `FK_user_user_id2` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`user_id`);

--
-- Constraints for table `user_album_tracklist`
--
ALTER TABLE `user_album_tracklist`
  ADD CONSTRAINT `FK_song_song_id2` FOREIGN KEY (`song_id`) REFERENCES `song` (`song_id`),
  ADD CONSTRAINT `FK_user_album_user_album_id2` FOREIGN KEY (`user_album_id`) REFERENCES `user_album` (`user_album_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
