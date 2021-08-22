-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2021 at 10:24 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 7.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `forum_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment_tbl`
--

CREATE TABLE `comment_tbl` (
  `comment_id` int(11) NOT NULL,
  `thread_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment_tbl`
--

INSERT INTO `comment_tbl` (`comment_id`, `thread_id`, `user_id`, `comment`) VALUES
(20, '12', '5', 'My first comment for about this topic'),
(21, '12', '6', 'Second account comment');

-- --------------------------------------------------------

--
-- Table structure for table `thread_tbl`
--

CREATE TABLE `thread_tbl` (
  `thread_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `thread` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `thread_tbl`
--

INSERT INTO `thread_tbl` (`thread_id`, `title`, `thread`, `user_id`) VALUES
(12, 'Computers are very important in education.', 'When it comes to technology, many of us have become reliant and use tech on a daily basis for work, pleasure, or both. More specifically, we have become reliant on internet tech and computers for many purposes. We go online using our laptop or desktop com', '5'),
(13, 'Success in life means money.', 'Success in life means money,Money is an important thing in life. Money is important to provide basic life requirements such as food, medicine and education. ... But sometimes money is the secret of happiness and success in life. Money is the cornerstone o', '5');

-- --------------------------------------------------------

--
-- Table structure for table `user_tbl`
--

CREATE TABLE `user_tbl` (
  `user_id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_tbl`
--

INSERT INTO `user_tbl` (`user_id`, `fullname`, `email`, `password`) VALUES
(5, 'Arjohn Ely', 'arjohn@gmail.com', '222222'),
(6, 'Sample User', 'user@gmail.com', '111111');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment_tbl`
--
ALTER TABLE `comment_tbl`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `thread_tbl`
--
ALTER TABLE `thread_tbl`
  ADD PRIMARY KEY (`thread_id`);

--
-- Indexes for table `user_tbl`
--
ALTER TABLE `user_tbl`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment_tbl`
--
ALTER TABLE `comment_tbl`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `thread_tbl`
--
ALTER TABLE `thread_tbl`
  MODIFY `thread_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_tbl`
--
ALTER TABLE `user_tbl`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
