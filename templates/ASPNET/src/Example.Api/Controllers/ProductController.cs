using Example.Api.Authorization;
using Example.Api.Helpers;
using Example.Application.Common.DTO;
using Example.Application.Common.Interfaces.Services;
using Example.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Example.Api.Controllers;

[ApiController]
[Route("api/v1/products")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [RequirePermission("products.read")]
    public async Task<ActionResult<List<ProductDto>>> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    [RequirePermission("products.read")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product is null) throw AppExceptions.NotFound("Product not found");
        return Ok(product);
    }

    [HttpPost]
    [RequirePermission("products.create")]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductRequest request)
    {
        var userId = HttpContext.GetCurrentUserId();
        if (userId is null) throw AppExceptions.Unauthorized();
        var result = await _productService.CreateAsync(userId.Value, request);
        return Created($"/api/v1/products/{result.Id}", result);
    }

    [HttpPut("{id:guid}")]
    [RequirePermission("products.update")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, [FromBody] UpdateProductRequest request)
    {
        var userId = HttpContext.GetCurrentUserId();
        if (userId is null) throw AppExceptions.Unauthorized();
        var result = await _productService.UpdateAsync(userId.Value, id, request);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission("products.delete")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userId = HttpContext.GetCurrentUserId();
        if (userId is null) throw AppExceptions.Unauthorized();
        await _productService.DeleteAsync(userId.Value, id);
        return Ok(new { message = "Product deleted successfully" });
    }
}
