-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2023 at 12:25 AM
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
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `album`
--

INSERT INTO `album` (`album_id`, `album_title`, `artist`, `album_desc`, `year_of_release`, `genre_id`) VALUES
(2, 'Castle of Glass', 'Linkin Park', 'Troubleshooting as we speak', 2012, 1),
(3, 'Meteora', 'Linkin Park', 'Troubleshooting as we speak', 2003, 1),
(6, 'Hybrid Theory', 'Linkin Park', 'Testing 567', 2000, 1),
(10, 'Ex-Military', 'Death Grips', 'MC Ride', 2011, 1),
(11, 'The Money Store', 'Death Grips', 'MC Ride', 2012, 1),
(14, 'Ten', 'Pearl Jam', 'undefined', 0000, 2),
(17, 'TesterParadise', 'Tester', 'Lets hope this works', 1984, 2),
(18, 'Deep Purple in Rock', 'Deep Purple', 'Deep Purples fourth album', 1970, 2),
(19, 'Deeper Purple in Rock', 'Deep Purple', 'Deep Purples fourthier album', 1970, 2),
(39, 'Test', '2', 'To test this works        ', 1999, 1),
(40, 'Test2', 'Proving it again', 'To test again that format is correct', 1905, 1);

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
(1, 2, 1);

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
(4, 3, 2);

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
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`user_id`, `username`, `password`, `first_name`, `last_name`, `status`) VALUES
(1, 'drobin', 'admin123', 'Guess', 'Who', 'Admin'),
(2, 'bobbyb', 'password', 'Robert', 'Baratheon', 'Admin'),
(3, 'TommyBoy', 'password123', 'Thomas ', 'Richards', 'Member');

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
(1, 'Nu Metal', 'Bla bla'),
(2, 'Rock and Roll', 'You know it, and I know it.');

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
(2, 2, 'Tommy\'s collection is pretty good tbh. ');

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
(3, 'Castle of Glass', '04:30:00');

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
(1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_album`
--

CREATE TABLE `user_album` (
  `user_album_id` int(11) NOT NULL,
  `custom_album_name` varchar(255) NOT NULL,
  `album_desc` text NOT NULL,
  `genre_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_album`
--

INSERT INTO `user_album` (`user_album_id`, `custom_album_name`, `album_desc`, `genre_id`, `user_id`) VALUES
(1, 'Tommy Boy\'s greatest', 'Some of my fav songs. ', 1, 3);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `album`
--
ALTER TABLE `album`
  MODIFY `album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `album_review`
--
ALTER TABLE `album_review`
  MODIFY `album_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `album_tracklist`
--
ALTER TABLE `album_tracklist`
  MODIFY `album_tracklist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `genre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `song`
--
ALTER TABLE `song`
  MODIFY `song_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `useralbum_review`
--
ALTER TABLE `useralbum_review`
  MODIFY `user_album_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_album`
--
ALTER TABLE `user_album`
  MODIFY `user_album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
