document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const chatMessages = document.querySelector('.chat-messages');
    const sendButton = document.querySelector('.send-button');
    const menuToggle = document.getElementById('menu-toggle');
    const panel = document.querySelector('.panel');
    const copyButton = document.querySelectorAll('.panel-item')[1];
    const backgroundButton = document.getElementById('background-btn');
    const settingsButton = document.querySelectorAll('.panel-item')[3];
    const nicknameButton = document.getElementById('nickname-btn');
    const nicknameModal = document.getElementById('nickname-modal');
    const nicknameInput = document.getElementById('nickname-input');
    const saveNicknameBtn = document.getElementById('save-nickname');
    const cancelNicknameBtn = document.getElementById('cancel-nickname');
    const backgroundModal = document.getElementById('background-modal');
    const backgroundOptions = document.querySelectorAll('.background-option');
    const selectImageBtn = document.getElementById('select-image-btn');
    const bgImageUpload = document.getElementById('bg-image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const saveBackgroundBtn = document.getElementById('save-background');
    const cancelBackgroundBtn = document.getElementById('cancel-background');
    const chatDropdownToggle = document.getElementById('chat-dropdown-toggle');
    const chatDropdown = document.querySelector('.chat-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const attachButton = document.querySelector('.attach-button');
    const attachMenu = document.querySelector('.attach-menu');
    const attachItems = document.querySelectorAll('.attach-item');
    const messageImagePreview = document.getElementById('message-image-preview');
    const messageImage = document.getElementById('message-image');
    const removeMessageImageBtn = document.getElementById('remove-message-image-btn');
    
    // 현재 첨부된 이미지 데이터
    let attachedImage = null;
    
    // 사용자 정보 (로컬 스토리지에서 불러오거나 기본값 사용)
    let currentUser = {
        name: localStorage.getItem('chatUsername') || '사용자',
        initial: localStorage.getItem('chatUserInitial') || '사',
        color: localStorage.getItem('chatUserColor') || '#2196f3'
    };
    
    // 배경 설정 상태 변수
    let currentBackground = {
        type: 'color', // 'color' 또는 'image'
        value: '#f9f9f9' // 색상 값 또는 이미지 데이터 URL
    };
    
    // 배경 로드 함수
    function loadBackground() {
        // 로컬 스토리지에서 배경 설정 불러오기
        const savedBackgroundType = localStorage.getItem('chatBackgroundType') || 'color';
        const savedBackgroundValue = localStorage.getItem('chatBackgroundValue') || '#f9f9f9';
        
        currentBackground.type = savedBackgroundType;
        currentBackground.value = savedBackgroundValue;
        
        applyBackground();
    }
    
    // 배경 적용 함수
    function applyBackground() {
        if (currentBackground.type === 'color') {
            chatMessages.style.backgroundImage = 'none';
            chatMessages.style.backgroundColor = currentBackground.value;
        } else if (currentBackground.type === 'image') {
            chatMessages.style.backgroundImage = `url(${currentBackground.value})`;
            chatMessages.style.backgroundSize = 'cover';
            chatMessages.style.backgroundPosition = 'center';
        }
    }
    
    // 초기 배경 로드
    loadBackground();
    
    // 초기 배경색에 맞게 선택 상태 업데이트
    updateBackgroundSelection();
    
    // 닉네임 변경 버튼 클릭
    nicknameButton.addEventListener('click', function() {
        // 패널 닫기
        panel.classList.remove('show');
        
        // 현재 사용자 정보를 입력란에 설정
        nicknameInput.value = currentUser.name;
        
        // 모달 표시
        nicknameModal.classList.add('show');
    });
    
    // 배경화면 변경 버튼 클릭
    backgroundButton.addEventListener('click', function() {
        // 패널 닫기
        panel.classList.remove('show');
        
        // 현재 배경 설정에 맞게 모달 업데이트
        updateBackgroundSelection();
        
        // 모달 표시
        backgroundModal.classList.add('show');
    });
    
    // 배경화면 옵션 클릭
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 이미지 선택 초기화
            imagePreviewContainer.style.display = 'none';
            imagePreview.src = '';
            
            // 기존 선택 제거
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
            
            // 새 선택 표시
            this.classList.add('active');
        });
    });
    
    // 사진 선택 버튼 클릭
    selectImageBtn.addEventListener('click', function() {
        bgImageUpload.click();
    });
    
    // 이미지 파일 선택 변경
    bgImageUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // 선택된 모든 색상 옵션 비활성화
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
            
            // 파일 크기 검사 (최대 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('이미지 크기는 5MB 이하로 선택해주세요.');
                return;
            }
            
            // 이미지 미리보기 표시
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 이미지 제거 버튼 클릭
    removeImageBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 이벤트 버블링 방지
        
        // 이미지 미리보기 숨기기
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
        bgImageUpload.value = '';
        
        // 기본 색상 선택
        backgroundOptions[0].click();
    });
    
    // 배경화면 취소
    cancelBackgroundBtn.addEventListener('click', function() {
        backgroundModal.classList.remove('show');
    });
    
    // 배경화면 적용
    saveBackgroundBtn.addEventListener('click', function() {
        // 이미지가 선택되었는지 확인
        if (imagePreviewContainer.style.display !== 'none' && imagePreview.src) {
            // 이미지 배경으로 설정
            currentBackground.type = 'image';
            currentBackground.value = imagePreview.src;
        } else {
            // 선택된 색상 배경으로 설정
            const activeOption = document.querySelector('.background-option.active');
            if (activeOption) {
                currentBackground.type = 'color';
                currentBackground.value = activeOption.getAttribute('data-color');
            }
        }
        
        // 배경 적용
        applyBackground();
        
        // 로컬 스토리지에 저장
        localStorage.setItem('chatBackgroundType', currentBackground.type);
        localStorage.setItem('chatBackgroundValue', currentBackground.value);
        
        // 모달 닫기
        backgroundModal.classList.remove('show');
        
        // 사용자에게 알림
        alert('배경화면이 변경되었습니다.');
    });
    
    // 기존 배경 설정에 맞게 모달 업데이트
    function updateBackgroundSelection() {
        // 이미지 미리보기 초기화
        if (currentBackground.type === 'image') {
            // 이미지 배경인 경우 미리보기 표시
            imagePreview.src = currentBackground.value;
            imagePreviewContainer.style.display = 'block';
            
            // 모든 색상 옵션 비활성화
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
        } else {
            // 색상 배경인 경우
            imagePreviewContainer.style.display = 'none';
            imagePreview.src = '';
            
            // 현재 색상과 일치하는 옵션 찾기
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
            
            const matchingOption = Array.from(backgroundOptions).find(
                opt => opt.getAttribute('data-color') === currentBackground.value
            );
            
            if (matchingOption) {
                matchingOption.classList.add('active');
            } else {
                // 일치하는 옵션이 없으면 기본 옵션 선택
                backgroundOptions[0].classList.add('active');
            }
        }
    }
    
    // 닉네임 변경 취소
    cancelNicknameBtn.addEventListener('click', function() {
        nicknameModal.classList.remove('show');
    });
    
    // 모달 외부 클릭 시 닫기
    nicknameModal.addEventListener('click', function(e) {
        if (e.target === nicknameModal) {
            nicknameModal.classList.remove('show');
        }
    });
    
    backgroundModal.addEventListener('click', function(e) {
        if (e.target === backgroundModal) {
            backgroundModal.classList.remove('show');
        }
    });
    
    // 닉네임 저장
    saveNicknameBtn.addEventListener('click', function() {
        const newNickname = nicknameInput.value.trim();
        
        if (newNickname !== '') {
            // 닉네임 업데이트
            currentUser.name = newNickname;
            
            // 닉네임의 첫 글자를 이니셜로 사용
            currentUser.initial = newNickname.charAt(0);
            
            // 로컬 스토리지에 저장
            localStorage.setItem('chatUsername', currentUser.name);
            localStorage.setItem('chatUserInitial', currentUser.initial);
            
            // 모달 닫기
            nicknameModal.classList.remove('show');
            
            // 사용자에게 알림
            alert(`닉네임이 '${currentUser.name}'(으)로 변경되었습니다.`);
        } else {
            alert('닉네임을 입력해주세요.');
        }
    });
    
    // 메시지에 첨부된 이미지 제거 버튼 클릭
    removeMessageImageBtn.addEventListener('click', function() {
        // 첨부 이미지 초기화
        attachedImage = null;
        messageImagePreview.style.display = 'none';
        messageImage.src = '';
    });
    
    // 첨부 버튼 토글
    attachButton.addEventListener('click', function(e) {
        e.stopPropagation();
        attachMenu.classList.toggle('show');
        
        // 다른 메뉴가 열려있다면 닫기
        panel.classList.remove('show');
        chatDropdown.classList.remove('show');
        chatDropdownToggle.classList.remove('active');
    });
    
    // 첨부 아이템 클릭
    attachItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const type = index === 0 ? '카메라' : '사진';
            
            if (type === '카메라') {
                // 카메라 기능 구현 (실제로는 여기에 카메라 API 연결)
                alert('카메라가 열립니다.');
            } else {
                // 파일 선택 다이얼로그 열기
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.click();
                
                fileInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
                        const file = this.files[0];
                        
                        // 파일 크기 검사 (최대 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                            alert('이미지 크기는 5MB 이하로 선택해주세요.');
                            return;
                        }
                        
                        // 이미지 미리보기 표시
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            // 이미지 데이터 저장
                            attachedImage = e.target.result;
                            
                            // 미리보기 표시
                            messageImage.src = attachedImage;
                            messageImagePreview.style.display = 'block';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
            
            attachMenu.classList.remove('show');
        });
    });
    
    // 채팅 드롭다운 토글
    chatDropdownToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        chatDropdownToggle.classList.toggle('active');
        chatDropdown.classList.toggle('show');
        
        // 다른 패널이 열려있다면 닫기
        panel.classList.remove('show');
    });
    
    // 드롭다운 아이템 클릭
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const chatType = this.textContent;
            alert(`${chatType} 선택됨`);
            chatDropdown.classList.remove('show');
            chatDropdownToggle.classList.remove('active');
        });
    });
    
    // 메뉴 토글 기능
    menuToggle.addEventListener('click', function() {
        panel.classList.toggle('show');
        
        // 다른 드롭다운이 열려있다면 닫기
        chatDropdown.classList.remove('show');
        chatDropdownToggle.classList.remove('active');
    });
    
    // 패널 및 드롭다운, 첨부 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !panel.contains(event.target)) {
            panel.classList.remove('show');
        }
        
        if (!chatDropdownToggle.contains(event.target) && !chatDropdown.contains(event.target)) {
            chatDropdown.classList.remove('show');
            chatDropdownToggle.classList.remove('active');
        }
        
        if (!attachButton.contains(event.target) && !attachMenu.contains(event.target)) {
            attachMenu.classList.remove('show');
        }
    });
    
    // 메시지 전송 함수
    function sendMessage() {
        if (messageInput.value.trim() !== '' || attachedImage) {
            // 새 메시지 추가
            addMessage(currentUser.name, messageInput.value, currentUser.initial, currentUser.color, attachedImage);
            
            // 입력창 비우기
            messageInput.value = '';
            
            // 첨부 이미지 초기화
            attachedImage = null;
            messageImagePreview.style.display = 'none';
            messageImage.src = '';
            
            // 자동 스크롤
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // 엔터 키 이벤트
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 전송 버튼 클릭 이벤트
    sendButton.addEventListener('click', sendMessage);
    
    // 새 메시지 추가 함수
    function addMessage(username, text, initial, color, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        // 현재 시간 가져오기
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours < 12 ? '오전' : '오후'} ${hours % 12 || 12}:${minutes}`;
        
        let messageContent = `
            <div class="avatar" style="background-color: ${color}">${initial}</div>
            <div class="message-content">
                <div class="username">${username}</div>
        `;
        
        if (imageUrl) {
            // 이미지는 항상 말풍선 밖에 표시
            messageContent += `
                <div class="message-image-only">
                    <img src="${imageUrl}" alt="첨부된 이미지">
                </div>
            `;
            
            // 텍스트가 있으면 별도의 말풍선에 표시
            if (text && text.trim() !== '') {
                messageContent += `<div class="text-container"><div class="text"><p>${text}</p></div><div class="message-time">${timeString}</div></div>`;
            } else {
                // 이미지만 있는 경우 이미지 옆에 시간 표시
                messageContent += `<div class="message-time">${timeString}</div>`;
            }
        } else {
            // 이미지 없이 텍스트만 있는 경우 기존 방식으로 표시하고 시간 추가
            messageContent += `<div class="text-container"><div class="text">${text}</div><div class="message-time">${timeString}</div></div>`;
        }
        
        messageContent += '</div>';
        
        messageDiv.innerHTML = messageContent;
        chatMessages.appendChild(messageDiv);
    }
    
    // 링크복사 버튼 기능
    copyButton.addEventListener('click', function() {
        // 현재 페이지 URL 가져오기
        const chatLink = window.location.href;
        
        // 클립보드에 복사하기
        navigator.clipboard.writeText(chatLink)
            .then(() => {
                alert('채팅방 링크가 복사되었습니다!');
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                alert('링크 복사에 실패했습니다. 다시 시도해주세요.');
            });
        
        panel.classList.remove('show');
    });
    
    // 설정 버튼 기능
    settingsButton.addEventListener('click', function() {
        alert('설정 페이지로 이동합니다.');
        panel.classList.remove('show');
    });
    
    // 이미지 확대 모달 생성
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <div class="image-modal-content">
            <img src="" alt="확대된 이미지">
            <button class="close-image-modal">×</button>
        </div>
    `;
    document.body.appendChild(imageModal);
    
    // 이미지 클릭 이벤트 위임
    chatMessages.addEventListener('click', function(e) {
        // 이미지 요소를 클릭했는지 확인
        if (e.target.tagName === 'IMG' && e.target.closest('.message-image-only')) {
            const imgSrc = e.target.src;
            const modalImg = imageModal.querySelector('img');
            modalImg.src = imgSrc;
            imageModal.classList.add('show');
        }
    });
    
    // 모달 닫기 버튼 이벤트
    const closeModalBtn = imageModal.querySelector('.close-image-modal');
    closeModalBtn.addEventListener('click', function() {
        imageModal.classList.remove('show');
    });
    
    // 모달 바깥 영역 클릭시 닫기
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.classList.remove('show');
        }
    });
    
    // 예시 자동 응답 (데모용)
    setTimeout(() => {
        addMessage('뷔얘봇', '안녕하세요. 뷔얘봇입니다. 무엇을 도와드릴까요?', 'V', '#ff9800');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}); 