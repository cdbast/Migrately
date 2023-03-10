USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Resources_Select_ById]    Script Date: 12/28/2022 10:32:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Chris Bast>
-- Create date: <11/17/22>
-- Description: <Resource GetById>
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Resources_Select_ById]
			@Id int 

/*
Declare @Id int = 2

Execute dbo.Resources_Select_ById
		@Id

*/
as

BEGIN
SELECT r.Id
      ,r.ResourceCategoryId
	  ,rc.Name
      ,r.Name
      ,r.Description
      ,r.Logo
      ,r.LocationId
	  ,l.LocationTypeId
	  ,lt.Name
	  ,l.LineOne
	  ,l.LineTwo
	  ,l.City
	  ,l.Zip
	  ,s.Name
	  ,l.StateId
	  ,l.Latitude
	  ,l.Longitude
	  ,l.DateCreated
	  ,l.DateCreated
	  ,l.CreatedBy
	  ,l.ModifiedBy
      ,r.ContactName
      ,r.ContactEmail
      ,r.Phone
      ,r.SiteUrl
      ,r.IsActive
      ,r.DateCreated
      ,r.DateModified
  FROM [dbo].[Resources] as r 
	inner join dbo.ResourceCategories as rc
	on r.ResourceCategoryId = rc.Id
		full outer join dbo.Locations as l
		on r.LocationId = l.Id
			full outer join dbo.LocationTypes as lt
			on l.LocationTypeId = lt.Id
				full outer join  dbo.States as s
				on l.StateId = s.Id
		where r.Id = @Id 

END


