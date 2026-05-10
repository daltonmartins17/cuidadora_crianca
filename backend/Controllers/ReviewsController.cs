using CuidadoraDeCrianca.Data;
using CuidadoraDeCrianca.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Claims;

namespace CuidadoraDeCrianca.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetAuthenticatedUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        [HttpGet("profile/{profileId}")]
        public async Task<IActionResult> GetProfileReviews(int profileId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.ReviewerUser)
                .Where(r => r.ProfileId == profileId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            var reviewerId = GetAuthenticatedUserId();
            if (reviewerId == 0)
                return Unauthorized("Utilizador não autenticado");

            if (createReviewDto.Rating < 1 || createReviewDto.Rating > 5)
                return BadRequest("Avaliação deve estar entre 1 e 5");

            var profile = await _context.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == createReviewDto.ProfileId);
            if (profile == null)
                return NotFound("Perfil não encontrado");

            var reviewer = await _context.Users.FindAsync(reviewerId);
            if (reviewer == null)
                return NotFound("Utilizador não encontrado");

            if (!string.Equals(reviewer.UserType, "Parent", StringComparison.OrdinalIgnoreCase))
                return Forbid("Apenas pais podem avaliar babás");

            if (profile.UserId == reviewerId)
                return BadRequest("Não pode avaliar o seu próprio perfil");

            if (profile.User == null || !string.Equals(profile.User.UserType, "BabySitter", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Apenas perfis de babás podem receber avaliações");

            var review = new Review
            {
                ProfileId = createReviewDto.ProfileId,
                ReviewerUserId = reviewerId,
                Rating = createReviewDto.Rating,
                Title = createReviewDto.Title,
                Comment = createReviewDto.Comment
            };

            _context.Reviews.Add(review);

            // Atualizar média de avaliações
            var allReviews = await _context.Reviews.Where(r => r.ProfileId == createReviewDto.ProfileId).ToListAsync();
            profile.AverageRating = allReviews.Average(r => r.Rating);
            profile.TotalReviews = allReviews.Count;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Avaliação criada com sucesso", reviewId = review.Id });
        }
    }

    public class CreateReviewDto
    {
        public int ProfileId { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; } = null!;
        public string Comment { get; set; } = null!;
    }
}
