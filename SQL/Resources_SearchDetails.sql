USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Resources_SearchDetails]    Script Date: 12/28/2022 10:27:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Chris Bast>
-- Create date: <11/17/22>
-- Description: <Resource SearchDetails>
-- Code Reviewer: Sam Mcgill

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Resources_SearchDetails]
			@PageIndex int
	,@PageSize int
	,@Query nvarchar(50)

/*
Declare @PageIndex int = 0
		,@PageSize int = 10
		,@Query nvarchar(50) = 'hias'

Execute dbo.Resources_SearchDetails
		@PageIndex
		,@PageSize
		,@Query

*/
as

BEGIN

Declare @offSet int = @PageIndex * @PageSize

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
	  ,l.StateId
	  ,s.Name
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
	  ,TotalCount = COUNT(1) OVER()
  FROM [dbo].[Resources] as r 
	inner join dbo.ResourceCategories as rc
	on r.ResourceCategoryId = rc.Id
		full outer join dbo.Locations as l
		on r.LocationId = l.Id
			full outer join dbo.LocationTypes as lt
			on l.LocationTypeId = lt.Id
				full outer join  dbo.States as s
				on l.StateId = s.Id
		where 
		(r.Name LIKE '%' + @Query + '%' or 
		   r.Description LIKE '%' + @Query + '%')

	ORDER BY r.Id
	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY

END


