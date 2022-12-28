using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Resources
{
    public class ResourceAddRequest
    {
        [Required]
        [Range(minimum:1, int.MaxValue)]
        public int ResourceCategoryId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(1000)]
        public string Description { get; set; }
        [MaxLength(255)]
        public string Logo { get; set; }
        [Required]
        [Range(minimum:1, int.MaxValue)]
        public int LocationId { get; set; }
        [MaxLength(200)]
        public string ContactName { get; set; }
        [MaxLength(255)]
        public string ContactEmail { get; set; }
        [MaxLength(250)]
        public string Phone { get; set; }
        [MaxLength(255)]
        public string SiteUrl { get; set; }
    }
}
