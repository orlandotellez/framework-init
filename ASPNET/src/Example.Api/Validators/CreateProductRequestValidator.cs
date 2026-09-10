using FluentValidation;
using Example.Application.Common.DTO;

namespace Example.Api.Validators;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required").MaximumLength(255).WithMessage("Name cannot exceed 255 characters");
        RuleFor(x => x.Description).MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters");
        RuleFor(x => x.Price).GreaterThan(0).WithMessage("Price must be greater than 0");
        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative");
    }
}
