const App = {
  data() {
    return {
      API: "https://thronesapi.com/api/v2/Characters",
      characters: [],

      firstName: "",
      lastName: "",
      family: "",
      title: "",
      imageUrl: "",

      selectOption: "",
      sortOption: [
        { value: "firstName", name: "По имени(A-Z)" },
        { value: "lastName", name: "По фамилии(A-Z)" },
      ],

      selectFamilyOption: "",
      sortFamilyOption: [
        { value: "House Stark", name: "Старки" },
        { value: "House Targaryen", name: "Таргариены" },
        { value: "Greyjoy", name: "Грейджои" },
      ],

      searchValue: "",

      userLogin: "",
      userPassword: "",

      modalAuth: false,
      modalReg: false,

      isAuth: false,

      newUserLogin: "",
      newUserPassword: "",
      interests: [],
      adult: "",
    };
  },
  methods: {
    async getAllCharacters() {
      const responcse = await fetch(this.API);
      this.characters = await responcse.json();
    },
    createNewCharacter() {
      if (!this.firstName || !this.lastName || !this.family || !this.title) {
        return;
      }

      const objCharacter = {
        id: this.getLastCharacterId() + 1,
        firstName: this.firstName,
        lastName: this.lastName,
        fullName: `${this.firstName} ${this.lastName}`,
        family: this.family,
        title: this.title,
        imageUrl: this.imageUrl || `image/${Math.floor(Math.random() * 6)}.jpg`,
      };
      this.characters = [objCharacter, ...this.characters];

      this.firstName = "";
      this.lastName = "";
      this.family = "";
      this.title = "";
      this.imageUrl = "";
    },
    removeCharacter(id) {
      this.characters = this.characters.filter(
        (character) => character.id !== id
      );
    },
    getLastCharacterId() {
      let maxId = 0;
      for (let i = 0; i < this.characters.length; i++) {
        if (this.characters[i].id > maxId) {
          maxId = this.characters[i].id;
        }
      }
      return maxId;
    },
    openAuth() {
      this.modalAuth = true;
    },
    openReg() {
      this.modalReg = true;
    },
    closeModal(event) {
      if (
        event.target.className == "entranceModal" ||
        event.target.className == "btn-form-danger"
      ) {
        this.modalReg = false;
        this.modalAuth = false;
      }
    },
    userCheck() {
      if (this.userLogin == "" || this.userPassword == "") {
        return;
      }

      console.log(localStorage.length);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage[key];
        const user = JSON.parse(value);
        if (
          user.userLogin == this.userLogin &&
          user.userPassword == this.userPassword
        ) {
          this.isAuth = true;
          this.modalAuth = false;
          this.userLogin = "";
          this.userPassword = "";
          return;
        }
      }

      alert("Пользователь не найден");
    },
    registNewUser() {
      if (
        this.newUserLogin == "" ||
        this.newUserPassword == "" ||
        this.adult == ""
      ) {
        return;
      }

      let key = Date.now();
      const user = {
        userLogin: this.newUserLogin,
        userPassword: this.newUserPassword,
        adult: this.adult,
        interests: this.interests,
      };
      localStorage.setItem(key.toString(), JSON.stringify(user));
      this.modalReg = false;
      this.modalReg = false;
      this.newUserLogin = "";
      this.newUserPassword = "";
      this.interests = [];
      this.adult = "";
    },
  },
  computed: {
    getCountCharacters() {
      return this.sortedAndSearchCharacters.length;
    },
    countLengthCharacters() {
      if (this.getCountCharacters === 0) {
        return false;
      }

      return true;
    },
    sortedFamilyCharacters() {
      if (this.selectFamilyOption === "") {
        return [...this.characters];
      }

      return [...this.characters].filter(
        (item) => item.family === this.selectFamilyOption
      );
    },
    sortedCharacters() {
      return this.sortedFamilyCharacters.sort((character1, character2) =>
        character1[this.selectOption]?.localeCompare(
          character2[this.selectOption]
        )
      );
    },
    sortedAndSearchCharacters() {
      return this.sortedCharacters.filter(
        (character) =>
          character.firstName
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()) ||
          character.lastName
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
      );
    },
  },
  mounted() {
    this.getAllCharacters();
  },
};

Vue.createApp(App).mount("#app");
