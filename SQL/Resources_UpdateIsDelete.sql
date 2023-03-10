USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Resources_Update_IsDelete]    Script Date: 12/28/2022 10:33:08 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Chris Bast>
-- Create date: <11/17/22>
-- Description: <Delete Resource (Update isActive bool)>
-- Code Reviewer: Sam Mcgill

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Resources_Update_IsDelete]
			@Id int

/*
Declare @Id int = 1

Select @Id

Select *
From dbo.Resources
Where Id = @Id

Execute [dbo].[Resources_Update_IsDelete]
		@Id

Select @Id

Select *
From dbo.Resources
Where Id = @Id
*/

as

BEGIN

Declare @IsActive bit = 0

UPDATE [dbo].[Resources]
   SET [IsActive] = @IsActive
      ,[DateModified] = GETUTCDATE()
 WHERE [Id] = @Id
END


