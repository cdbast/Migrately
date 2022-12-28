using Microsoft.AspNetCore.Mvc.RazorPages;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.Resouces;
using Sabio.Models.Requests.Locations;
using Sabio.Models.Requests.Resources;
using Sabio.Services.Interfaces;
using Stripe.Terminal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Location = Sabio.Models.Domain.Locations.Location;

namespace Sabio.Services
{
    public class ResourceService : IResourceService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        public ResourceService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }

        public Paged<Resource> GetByResourceType(int pageIndex, int pageSize, int resourceCategoryId)
        {
            Paged<Resource> pagedList = null;
            List<Resource> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Resources_Select_By_ResourceType]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@ResourceCategoryId", resourceCategoryId);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Resource aResource = MapSingleResource(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Resource>();
                    }

                    list.Add(aResource);
                });
            if (list != null)
            {
                pagedList = new Paged<Resource>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Resource> GetAll(int pageIndex, int pageSize)
        {
            Paged<Resource> pagedList = null;
            List<Resource> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Resources_Select_All]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Resource aResource = MapSingleResource(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Resource>();
                    }

                    list.Add(aResource);
                });
            if (list != null)
            {
                pagedList = new Paged<Resource>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Resource GetById(int id)
        {
            string procName = "[dbo].[Resources_Select_ById]";
            Resource aResource = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                aResource = MapSingleResource(reader, ref startingIndex);
            });
            return aResource;
        }

        public Paged<Resource> GetByLocationType(int pageIndex, int pageSize, int locationTypeId)
        {
            Paged<Resource> pagedList = null;
            List<Resource> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Resources_Select_By_LocationType]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@LocationTypeId", locationTypeId);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Resource aResource = MapSingleResource(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Resource>();
                    }

                    list.Add(aResource);
                });
            if (list != null)
            {
                pagedList = new Paged<Resource>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Resource> SearchDetails(int pageIndex, int pageSize, string query)
        {
            Paged<Resource> pagedList = null;
            List<Resource> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Resources_SearchDetails]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Resource aResource = MapSingleResource(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Resource>();
                    }

                    list.Add(aResource);
                });
            if (list != null)
            {
                pagedList = new Paged<Resource>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int Add(ResourceAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Resources_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonResourceParams(model, col);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = System.Data.ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void Update(ResourceUpdateRequest model)
        {
            string procName = "[dbo].[Resources_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonResourceParams(model, col);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Resources_Update_IsDelete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }

        private static void AddCommonResourceParams(ResourceAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@ResourceCategoryId", model.ResourceCategoryId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Logo", model.Logo);
            col.AddWithValue("@LocationId", model.LocationId);
            col.AddWithValue("@ContactName", model.ContactName);
            col.AddWithValue("@ContactEmail", model.ContactEmail);
            col.AddWithValue("@Phone", model.Phone);
            col.AddWithValue("@SiteUrl", model.SiteUrl);
        }
        private Resource MapSingleResource(IDataReader reader, ref int startingIndex)
        {
            Resource aResource = new Resource();
            aResource.LocationId = new Location();

            aResource.Id = reader.GetSafeInt32(startingIndex++);
            aResource.ResourceCategoryId = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aResource.Name = reader.GetSafeString(startingIndex++);
            aResource.Description = reader.GetSafeString(startingIndex++);
            aResource.Logo = reader.GetSafeString(startingIndex++);
            aResource.LocationId.Id = reader.GetSafeInt32(startingIndex++);
            aResource.LocationId.LocationType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aResource.LocationId.LineOne = reader.GetSafeString(startingIndex++);
            aResource.LocationId.LineTwo = reader.GetSafeString(startingIndex++);
            aResource.LocationId.City = reader.GetSafeString(startingIndex++);
            aResource.LocationId.Zip = reader.GetSafeString(startingIndex++);
            aResource.LocationId.State = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aResource.LocationId.Latitude = reader.GetSafeDouble(startingIndex++);
            aResource.LocationId.Longitude = reader.GetSafeDouble(startingIndex++);
            aResource.LocationId.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aResource.LocationId.DateModified = reader.GetSafeDateTime(startingIndex++);
            aResource.LocationId.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aResource.LocationId.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aResource.ContactName = reader.GetSafeString(startingIndex++);
            aResource.ContactEmail = reader.GetSafeString(startingIndex++);
            aResource.Phone = reader.GetSafeString(startingIndex++);
            aResource.SiteUrl = reader.GetSafeString(startingIndex++);
            aResource.IsActive = reader.GetSafeBool(startingIndex++);
            aResource.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aResource.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aResource;
        }
    }
}
