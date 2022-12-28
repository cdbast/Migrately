using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Resouces;
using Sabio.Models.Requests.Resources;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using System.Collections.Generic;
using System.Transactions;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/resources")]
    [ApiController]
    public class ResourceApiController : BaseApiController
    {
        private IResourceService _resourceService = null;
        private IAuthenticationService<int> _authService = null;

        public ResourceApiController(IResourceService service
            , ILogger<ResourceApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _resourceService = service;
            _authService = authService;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Resource>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Resource> page = _resourceService.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("resourcetypes")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetByResourceType(int pageIndex, int pageSize, int resourceCategoryId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Resource> page = _resourceService.GetByResourceType(pageIndex, pageSize, resourceCategoryId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("locationtypes")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetByLocationType(int pageIndex, int pageSize, int locationTypeId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Resource> page = _resourceService.GetByLocationType(pageIndex, pageSize, locationTypeId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Resource>>> SearchDetails(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Resource> page = _resourceService.SearchDetails(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Resource>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Resource resource = _resourceService.GetById(id);

                if (resource == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Resource> { Item = resource };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemsResponse<int>> Add(ResourceAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int id = _resourceService.Add(model);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ResourceUpdateRequest model)
        {

            int code = 200;
            BaseResponse response = null;


            try
            {
                _resourceService.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _resourceService.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
