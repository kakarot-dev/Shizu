/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
class User {
	public id: any;
	public name: any;
	public pastNames: any;
	public about: any;
	public bio: any;
	public aboutFormatted: any;
	public location: any;
	public website: any;
	public waifuOrHusbando: any;
	public toFollow: any;
	public followersCount: any;
	public followingCount: any;
	public createdAt: any;
	public updatedAt: any;
	public onboarded: any;
	public lifeSpentOnAnime: any;
	public birthday: any;
	public gender: any;
	public facebookId: any;
	public commentsCount: any;
	public likesGivenCount: any;
	public likesReceivedCount: any;
	public postsCount: any;
	public ratingsCount: any;
	public avatar: any;
	public coverImage: any;
	constructor(data) {
		this.id = data.id;
		this.name = data.attributes.name;
		this.pastNames = data.attributes.pastNames;
		this.about = data.attributes.about;
		this.bio = data.attributes.bio;
		this.aboutFormatted = data.attributes.aboutFormatted;
		this.location = data.attributes.location;
		this.website = data.attributes.website;
		this.waifuOrHusbando = data.attributes.waifuOrHusbando;
		this.toFollow = data.attributes.toFollow;
		this.followersCount = data.attributes.followersCount;
		this.followingCount = data.attributes.followingCount;
		this.createdAt = data.attributes.createdAt;
		this.updatedAt = data.attributes.updatedAt;
		this.onboarded = data.attributes.onboarded;
		this.lifeSpentOnAnime = data.attributes.lifeSpentOnAnime;
		this.birthday = data.attributes.birthday;
		this.gender = data.attributes.gender;
		this.facebookId = data.attributes.facebookId;
		this.commentsCount = data.attributes.commentsCount;
		this.likesGivenCount = data.attributes.likesGivenCount;
		this.likesReceivedCount = data.attributes.likesReceivedCount;
		this.postsCount = data.attributes.postsCount;
		this.ratingsCount = data.attributes.ratingsCount;
		this.avatar = data.attributes.avatar;
		this.coverImage = data.attributes.coverImage;
	}

	get url() {
		return `https://kitsu.io/users/${this.id}/`;
	}
}

export default User;
