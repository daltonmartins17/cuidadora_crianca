using CuidadoraDeCrianca.Data;
using CuidadoraDeCrianca.DTOs;
using CuidadoraDeCrianca.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IO;

namespace CuidadoraDeCrianca.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfilesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetAuthenticatedUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        private string? SaveProfileImage(IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return null;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder);

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"profile_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = System.IO.File.Create(filePath);
            file.CopyTo(stream);

            return $"/uploads/{fileName}";
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchBabySitters([FromQuery] string? city, [FromQuery] decimal? maxPrice)
        {
            var query = _context.Profiles
                .Include(p => p.User)
                .Include(p => p.Reviews)
                .Where(p => p.User!.UserType == "BabySitter" && p.IsAvailable);

            if (!string.IsNullOrEmpty(city))
                query = query.Where(p => p.City.ToLower().Contains(city.ToLower()));

            if (maxPrice.HasValue && maxPrice > 0)
                query = query.Where(p => p.PricePerHour <= maxPrice);

            var profiles = await query.ToListAsync();

            var result = profiles.Select(p => new ProfileDto
            {
                Id = p.Id,
                UserId = p.UserId,
                FullName = p.User!.FullName,
                Location = p.Location,
                City = p.City,
                District = p.District,
                PricePerHour = p.PricePerHour,
                Bio = p.Bio,
                Experience = p.Experience,
                Certifications = p.Certifications,
                AverageRating = p.AverageRating,
                TotalReviews = p.TotalReviews,
                IsAvailable = p.IsAvailable,
                Specializations = p.Specializations,
                ProfileImageUrl = p.User.ProfileImageUrl
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var profile = await _context.Profiles
                .Include(p => p.User)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (profile == null)
                return NotFound("Perfil não encontrado");

            var result = new ProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FullName = profile.User!.FullName,
                Location = profile.Location,
                City = profile.City,
                District = profile.District,
                PricePerHour = profile.PricePerHour,
                Bio = profile.Bio,
                Experience = profile.Experience,
                Certifications = profile.Certifications,
                AverageRating = profile.AverageRating,
                TotalReviews = profile.TotalReviews,
                IsAvailable = profile.IsAvailable,
                Specializations = profile.Specializations,
                ProfileImageUrl = profile.User.ProfileImageUrl
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProfile([FromForm] UpdateProfileDto updateProfileDto)
        {
            var userId = GetAuthenticatedUserId();
            if (userId == 0)
                return Unauthorized("Utilizador não autenticado");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Utilizador não encontrado");

            if (user.UserType != "BabySitter")
                return Forbid("Apenas cuidadoras podem criar perfil");

            if (await _context.Profiles.AnyAsync(p => p.UserId == userId))
                return BadRequest("Utilizador já tem um perfil");

            // Atualiza o nome completo do utilizador
            user.FullName = updateProfileDto.FullName;
            user.UpdatedAt = DateTime.UtcNow;

            var imageUrl = SaveProfileImage(updateProfileDto.ProfileImage);
            if (!string.IsNullOrEmpty(imageUrl))
            {
                user.ProfileImageUrl = imageUrl;
            }

            var profile = new Profile
            {
                UserId = userId,
                Location = updateProfileDto.Location,
                City = updateProfileDto.City,
                District = updateProfileDto.District,
                PricePerHour = updateProfileDto.PricePerHour,
                Bio = updateProfileDto.Bio,
                Experience = updateProfileDto.Experience,
                Certifications = updateProfileDto.Certifications,
                IsAvailable = updateProfileDto.IsAvailable,
                Specializations = updateProfileDto.Specializations
            };

            _context.Users.Update(user);
            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

            var result = new ProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FullName = user.FullName,
                Location = profile.Location,
                City = profile.City,
                District = profile.District,
                PricePerHour = profile.PricePerHour,
                Bio = profile.Bio,
                Experience = profile.Experience,
                Certifications = profile.Certifications,
                AverageRating = profile.AverageRating,
                TotalReviews = profile.TotalReviews,
                IsAvailable = profile.IsAvailable,
                Specializations = profile.Specializations,
                ProfileImageUrl = user.ProfileImageUrl
            };

            return CreatedAtAction("GetProfile", new { id = profile.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileDto updateProfileDto)
        {
            var userId = GetAuthenticatedUserId();
            var profile = await _context.Profiles.FindAsync(id);

            if (profile == null)
                return NotFound("Perfil não encontrado");

            if (profile.UserId != userId)
                return Forbid("Sem permissão para editar este perfil");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Utilizador não encontrado");

            if (user.UserType != "BabySitter")
                return Forbid("Apenas cuidadoras podem atualizar o perfil");

            user.FullName = updateProfileDto.FullName;
            user.UpdatedAt = DateTime.UtcNow;

            var imageUrl = SaveProfileImage(updateProfileDto.ProfileImage);
            if (!string.IsNullOrEmpty(imageUrl))
            {
                user.ProfileImageUrl = imageUrl;
            }

            profile.Location = updateProfileDto.Location;
            profile.City = updateProfileDto.City;
            profile.District = updateProfileDto.District;
            profile.PricePerHour = updateProfileDto.PricePerHour;
            profile.Bio = updateProfileDto.Bio;
            profile.Experience = updateProfileDto.Experience;
            profile.Certifications = updateProfileDto.Certifications;
            profile.IsAvailable = updateProfileDto.IsAvailable;
            profile.Specializations = updateProfileDto.Specializations;
            profile.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            _context.Profiles.Update(profile);
            await _context.SaveChangesAsync();

            return Ok("Perfil atualizado com sucesso");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            var profile = await _context.Profiles
                .Include(p => p.User)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NoContent();

            var result = new ProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FullName = profile.User!.FullName,
                Location = profile.Location,
                City = profile.City,
                District = profile.District,
                PricePerHour = profile.PricePerHour,
                Bio = profile.Bio,
                Experience = profile.Experience,
                Certifications = profile.Certifications,
                AverageRating = profile.AverageRating,
                TotalReviews = profile.TotalReviews,
                IsAvailable = profile.IsAvailable,
                Specializations = profile.Specializations,
                ProfileImageUrl = profile.User.ProfileImageUrl
            };

            return Ok(result);
        }
    }
}
