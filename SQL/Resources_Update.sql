USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Resources_Update]    Script Date: 12/28/2022 10:32:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Chris Bast>
-- Create date: <11/17/22>
-- Description: <Update Resource>
-- Code Reviewer: Sam Mcgill

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Resources_Update]
			@ResourceCategoryId int
           ,@Name nvarchar(200)
           ,@Description nvarchar(1000)
           ,@Logo nvarchar(255)
           ,@LocationId int
           ,@ContactName nvarchar(200)
           ,@ContactEmail nvarchar(255)
           ,@Phone nvarchar(50)
           ,@SiteUrl nvarchar(255)
		   ,@Id int 

/*
Declare @Id int = 3
Select @Id

Select *
From dbo.Resources
Where Id = @Id

Select *
From dbo.ResourceCategories
Where Id = @Id

Declare @ResourceCategoryId int = 3
        ,@Name nvarchar(200) = 'pr update name test'
        ,@Description nvarchar(1000) = 'pr update desc test'
        ,@Logo nvarchar(255) = 'update logo test'
        ,@LocationId int = 1
        ,@ContactName nvarchar(200) = 'update contact name test'
        ,@ContactEmail nvarchar(255) = 'update contact email test'
        ,@Phone nvarchar(50) = 'update phone test'
        ,@SiteUrl nvarchar(255) = 'update site url test'

Execute [dbo].[Resources_Update]
		@ResourceCategoryId
        ,@Name
        ,@Description
        ,@Logo
        ,@LocationId
        ,@ContactName
        ,@ContactEmail
        ,@Phone
        ,@SiteUrl
		,@id

Select @Id

Select *
From dbo.Resources
Where Id = @Id

Select *
From dbo.ResourceCategories
Where Id = @ResourceCategoryId

SELECT *
FROM [dbo].[Locations]
WHERE Id = @LocationId
*/

as

BEGIN

UPDATE [dbo].[Resources]
   SET [ResourceCategoryId] = @ResourceCategoryId
      ,[Name] = @Name
      ,[Description] = @Description
      ,[Logo] = @Logo
      ,[LocationId] = @LocationId
      ,[ContactName] = @ContactName
      ,[ContactEmail] = @ContactEmail
      ,[Phone] = @Phone
      ,[SiteUrl] = @SiteUrl
      ,[DateModified] = GETUTCDATE()
 WHERE [Id] = @Id
END


